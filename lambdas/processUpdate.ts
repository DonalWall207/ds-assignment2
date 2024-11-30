import { SNSEvent, SNSHandler } from "aws-lambda";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

// Initialize DynamoDB client.
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || "eu-west-1" });
const validMetadataTypes = ["Caption", "Date", "Photographer"];
const TABLE_NAME = "Images";

// Lambda function to handle SNS events and update DynamoDB table.
export const handler: SNSHandler = async (event: SNSEvent) => {
  for (const record of event.Records) {
    const snsMessage = JSON.parse(record.Sns.Message); // Parse the SNS message payload.
    const metadataType = record.Sns.MessageAttributes?.metadata_type?.Value;

    // It skips if metadata type is invalid.
    if (!metadataType || !validMetadataTypes.includes(metadataType)) {
      continue;
    }
    const { id, value } = snsMessage;

    // Update the DynamoDB table when both are given.
    if (id && value) {
      await updateTable(id, metadataType, value);
    }
  }
};

const updateTable = async (id: string, metadataType: string, value: string) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      ImageName: { S: id }, 
    },
    UpdateExpression: `SET #attr = :value`,
    ExpressionAttributeNames: {
      "#attr": metadataType,
    },
    ExpressionAttributeValues: {
      ":value": { S: value }, 
    },
  };

  await dynamoClient.send(new UpdateItemCommand(params)); 
};
