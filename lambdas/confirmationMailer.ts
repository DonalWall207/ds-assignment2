import { SQSHandler } from "aws-lambda";
import { SESClient, SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-ses";
import { SES_EMAIL_FROM, SES_EMAIL_TO, SES_REGION } from "../env";

// Check for missing environment variables
if (!SES_EMAIL_TO || !SES_EMAIL_FROM || !SES_REGION) {
  throw new Error(
    "Please add the SES_EMAIL_TO, SES_EMAIL_FROM and SES_REGION environment variables in an env.js file located in the root directory"
  );
}

type ContactDetails = {
  name: string;
  email: string;
  message: string;
};

const client = new SESClient({ region: SES_REGION });

export const handler: SQSHandler = async (event: any) => {
  console.log("Event ", event);

  // Iterate over all the records in the event
  for (const record of event.Records) {
    const recordBody = JSON.parse(record.body);
    const snsMessage = JSON.parse(recordBody.Message);

    if (snsMessage.Records) {
      console.log("SNS Message Records ", JSON.stringify(snsMessage));
      
      // Loop over all records in the SNS message
      for (const messageRecord of snsMessage.Records) {
        const s3e = messageRecord.s3;
        const srcBucket = s3e.bucket.name;
        const srcKey = decodeURIComponent(s3e.object.key.replace(/\+/g, " "));
        
        const fileType = srcKey.split('.').pop()?.toLowerCase();

        if (fileType === "jpeg" || fileType === "png") {
          // Email the user for a valid image file
          try {
            const { name, email, message }: ContactDetails = {
              name: "The Photo Album",
              email: SES_EMAIL_FROM,
              message: `We received your image. Its URL is s3://${srcBucket}/${srcKey}`,
            };

            const params = sendEmailParams({ name, email, message });
            await client.send(new SendEmailCommand(params));
          } catch (error: unknown) {
            console.log("Error sending email for valid image: ", error);
          }
        } else {
          // Email the user for invalid file types (non JPEG/PNG)
          try {
            const { name, email, message }: ContactDetails = {
              name: "The Photo Album",
              email: SES_EMAIL_FROM,
              message: `Image ${srcKey} has been rejected due to an invalid file type and will not be placed in the DynamoDB table.`,
            };

            const params = sendEmailParams({ name, email, message });
            await client.send(new SendEmailCommand(params));
          } catch (error: unknown) {
            console.log("Error sending email for invalid image type: ", error);
          }
        }
      }
    }
  }
};

function sendEmailParams({ name, email, message }: ContactDetails): SendEmailCommandInput {
  return {
    Destination: {
      ToAddresses: [SES_EMAIL_TO],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: getHtmlContent({ name, email, message }),
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `New Image Upload`,
      },
    },
    Source: SES_EMAIL_FROM,
  };
}

function getHtmlContent({ name, email, message }: ContactDetails): string {
  return `
    <html>
      <body>
        <h2>Sent from: </h2>
        <ul>
          <li style="font-size:18px">👤 <b>${name}</b></li>
          <li style="font-size:18px">✉️ <b>${email}</b></li>
        </ul>
        <p style="font-size:18px">${message}</p>
      </body>
    </html> 
  `;
}

function getTextContent({ name, email, message }: ContactDetails): string {
  return `
    Received an Email. 📬
    Sent from:
        👤 ${name}
        ✉️ ${email}
    ${message}
  `;
}
