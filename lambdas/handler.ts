import { S3Event } from "aws-lambda";
import * as dotenv from "dotenv";
import { Pool } from "pg";
import * as AWS from 'aws-sdk'
import { PhotoEditor } from "../utils/PhotoEditor";
import { PhotoRepository } from "../repositories/PhotoRepository";
import { S3Repository } from "../s3/S3Repository";
dotenv.config();

const S3Instance = new AWS.S3()

const photographersPool = new Pool({
    connectionString: process.env.DB_CONN_STRING as string,
});

const s3 = new S3Repository(S3Instance)

const photoEditor = new PhotoEditor()

const s3Repository = new S3Repository(S3Instance)
const photosRepository = new PhotoRepository(photographersPool)

export const hello = async (event: S3Event): Promise<any> => {
  const {key: keyObject} = event.Records[0].s3.object
  const keyArray = keyObject.split("/")
  const login = keyArray[1]
  const albumID = keyArray[2]
  const key = keyArray[3]
  const object = await s3.getPhoto(keyObject)
  const watermark = await s3Repository.getPhoto('water.png')
  const watermarked = await photoEditor.addWatermark(object.Body as Buffer, watermark.Body as Buffer)
  const resized = await photoEditor.resizePicture(object.Body as Buffer,400,400)
  const resize_water = await photoEditor.addWatermark(resized, watermark.Body as Buffer)
  await s3.loadPhoto(`watermark/${login}/${albumID}/${key}`, watermarked)
  await s3.loadPhoto(`thumbnail/${login}/${albumID}/${key}`, resized)
  await s3.loadPhoto(`full/${login}/${albumID}/${key}`, resize_water)
  await photosRepository.addPhotoToAlbum(albumID,key,login)
};
