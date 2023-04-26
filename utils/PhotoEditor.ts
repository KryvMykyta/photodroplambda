import * as sharp from "sharp";

export class PhotoEditor {
  public resizePicture = async (bufferImage: Buffer, width: number, height: number) => {
    const resizedPhoto = await sharp(bufferImage).resize(width, height).toBuffer();
    return resizedPhoto;
  };

  public addWatermark = async (bufferImage: Buffer, watermark: Buffer) => {
    const image = sharp(bufferImage)
    const metadata = await image.metadata()
    const watermarkResized = await sharp(watermark).resize(metadata.width, metadata.height).png().toBuffer()
    const watermarkPhoto = await sharp(bufferImage)
      .composite([{ input: watermarkResized, tile: true, }])
      .toBuffer();
    return watermarkPhoto;
  };

}
