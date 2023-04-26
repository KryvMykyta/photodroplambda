import { S3Event } from "aws-lambda";
import * as dotenv from "dotenv";
import * as AWS from "aws-sdk";
import { PhotoEditor } from "../utils/PhotoEditor";
import { S3Repository } from "../s3/S3Repository";
dotenv.config();

const S3Instance = new AWS.S3();

const s3 = new S3Repository(S3Instance);

const photoEditor = new PhotoEditor();

export const selfie = async (event: S3Event): Promise<any> => {
  const sleep = (m) => new Promise((r) => setTimeout(r, m));
  await sleep(500)
  const { key: keyObject } = event.Records[0].s3.object;
  const keyArray = keyObject.split("/");
  const key = keyArray[1];
  const object = await s3.getPhoto(keyObject);
  const resized = await photoEditor.resizePicture(
    object.Body as Buffer,
    50,
    50
  );
  await s3.loadPhoto(`selfies1/${key}`, resized);
};
