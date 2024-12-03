import { DynamoDB } from 'aws-sdk';
import { S3Handler, S3Event } from 'aws-lambda';

const dynamoDb = new DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME || "Images";

export const handler: S3Handler = async (event: S3Event) => {
  for (const record of event.Records) {
    const s3ObjectKey = record.s3.object.key;
    console.log(`Object deleted: ${s3ObjectKey}`);

    try {
      const params = {
        TableName: TABLE_NAME,
        Key: {
          ImageName: s3ObjectKey,
        },
      };

      await dynamoDb.delete(params).promise();
      console.log(`DynamoDB item deleted for: ${s3ObjectKey}`);
    } catch (error) {
      console.error(`Error deleting from DynamoDB: ${error}`);
      throw new Error(`Error deleting from DynamoDB: ${error}`);
    }
  }
};
