import * as AWS from 'aws-sdk'

// S3 file storage logic
const s3 = new AWS.S3({
  signatureVersion: 'v4'
});
const bucketName = process.env.ATTACHMENT_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

export function createAttachmentPresignedUrl(itemId: string) {
  var urlExpirationNum: number = +urlExpiration;
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: itemId,
    Expires: urlExpirationNum
  })
}

export function getCollectedItemAttachmentUrl(itemId: string) {
  return `https://${bucketName}.s3.amazonaws.com/${itemId}`
}