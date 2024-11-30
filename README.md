aws s3 cp test.txt s3://a-bucket/test.txt --metadata '{"x-amz-meta-cms-id":"34533452"}'


# How to get started

1. Clone this repository and add `env.ts` to the base file:
```
export const SES_REGION = 'eu-west-1';
export const SES_EMAIL_FROM = 'verified-identity-1'; 
export const SES_EMAIL_TO =  'verified-identity-2'; 
```
NOTE: The verified identities must be email addresses verified in your AWS account.

2. Run `cdk deploy`

3. Test the stack by uploading a picture from your local directory. 
```aws s3 cp ./images/sunflower.jpeg  s3://your_bucket_name/image3.jpeg```

4. To add Metadata to an image, use the following:
```aws sns publish --topic-arn "yout_ARN_value" --message-attributes file://attributes.json --message file://message.json```
