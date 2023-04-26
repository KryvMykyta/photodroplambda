import S3 from "aws-sdk/clients/s3";
import * as dotenv from "dotenv";
dotenv.config();

export class S3Repository {
  S3Instance: S3;
  bucketName: string;

  constructor(s3: S3) {
    this.S3Instance = s3;
    this.bucketName = process.env.PHOTOS_BUCKET_NAME as string;
  }

  public loadPhoto = async (photoKey: string, bufferImage: Buffer) => {
    const params = {
      Bucket: this.bucketName,
      Key: `${photoKey}`,
      Body: bufferImage,
    };
    console.log(params);
    await this.S3Instance.putObject(params).promise();
  };

  public getPhoto = async (photoKey: string) => {
    const params = {
      Bucket: this.bucketName,
      Key: photoKey,
    }
    return await this.S3Instance.getObject(params).promise()
  }

  public getPresignedPost = (photoKey: string) => {
    const params = {
      Bucket: this.bucketName,
      Key: photoKey,
      Expires: 300,
      Conditions: [["content-length-range", 0, 10 * 1024 * 1024]],
      Fields: {
        acl: 'bucket-owner-full-control',
        key: photoKey
      },
    }
    return this.S3Instance.createPresignedPost(params)
  }

  public getPhotoUrl = (photoKey: string, type: string) => {
    const requestKey = photoKey.replace('.', `${type}.`)
    const params = {
      Bucket: this.bucketName,
      Key: requestKey,
      Expires: 60,
    }
    return this.S3Instance.getSignedUrl('getObject',params)
  }

}
