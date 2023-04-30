import * as sharp from "sharp";

export class PhotoEditor {
  public resizePicture = async (bufferImage: Buffer, width: number, height: number) => {
    const resizedPhoto = await sharp(bufferImage).resize(width, height).toBuffer();
    return resizedPhoto;
  };
  public addWatermark = async (bufferImage: Buffer, watermark: Buffer) => {
    const image = sharp(bufferImage)
    const metadata = await image.metadata()
    const watermarkHeight = parseInt((metadata.height! * 0.41).toFixed(), 10)
    const watermarkWidth = parseInt((metadata.width! * 0.9).toFixed(), 10)
    const watermarkResized = await sharp(watermark).resize(watermarkWidth, watermarkHeight, { fit: 'fill'}).png().toBuffer()
    const watermarkPhoto = await sharp(bufferImage)
      .composite([{ input: watermarkResized }])
      .toBuffer();
    return watermarkPhoto;
  };
}