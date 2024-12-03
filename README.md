## Assignment 2 (EDA app) - Distributed Systems.

__Name:__ Donal Wall

__YouTube Demo link__ - https://youtu.be/QU_wGeo-A5I

### Phase 1.

+ Confirmation Mailer - Fully implemented.
+ Rejection Mailer - Fully implemented.
+ Log Image -  Fully implemented. 

### Phase 2 (if relevant).

+ Confirmation Mailer - Fully implemented.
+ Rejection Mailer - Fully implemented.
+ Log Image - Fully implemented.
+ Update Process/Table -  Fully implemented.

### Phase 3 (if relevant).

+ Confirmation Mailer - Fully implemented.
+ Process Image - Fully implemented.
+ Update Process/Table - Fully implemented.
+ Process Delete - Fully implemented.
+ Log Image - Fully implemented.

## How to get started

1. Clone this repository and add `env.ts` to the base file:
```
export const SES_REGION = 'eu-west-1';
export const SES_EMAIL_FROM = 'verified-identity-1'; 
export const SES_EMAIL_TO =  'verified-identity-2'; 
```
NOTE: The verified identities must be email addresses verified in your AWS account.

2. Run `cdk deploy`

3. To upload a picture from your local directory, use the following: 
```aws s3 cp ./images/sunflower.jpeg  s3://your_bucket_name/sunflower.jpeg```

4. To add Metadata to an image, use the following:
```aws sns publish --topic-arn "yout_ARN_value" --message-attributes file://attributes.json --message file://message.json```

5. To Delete an Image from the bucket, use the following:
```aws s3api delete-object --bucket bucket-name --key object-key```
