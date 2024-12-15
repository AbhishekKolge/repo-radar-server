import fs from 'fs/promises';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { Request } from 'express';
import { UploadedFile } from 'express-fileupload';
import { UploadResult } from 'src/domain/shared/types';
import { env } from 'src/infrastructure/config';
import { BadRequestError } from 'src/infrastructure/error';
import { MAX_IMAGE_SIZE } from 'src/shared/utils';

export class UploadService {
  private readonly appName: string;
  private readonly maxImageSize: number;

  constructor() {
    this.appName = env.APP_NAME;
    this.maxImageSize = MAX_IMAGE_SIZE;

    cloudinary.config({
      cloud_name: env.CLOUD_NAME,
      api_key: env.CLOUD_API_KEY,
      api_secret: env.CLOUD_API_SECRET,
    });
  }

  private getFolder(folder: string): string {
    return `${this.appName.split(' ').join('-')}/${folder}`;
  }

  async uploadGithubImage(imagePath: string, folder: string): Promise<UploadResult> {
    const result = await cloudinary.uploader.upload(imagePath, {
      use_filename: true,
      folder: this.getFolder(folder),
    });

    return this.formatUploadResult(result);
  }

  async uploadImage(key: string, folder: string, req: Request): Promise<UploadResult> {
    if (!req.files || !req.files[key]) {
      throw new BadRequestError('No file attached');
    }

    const image = req.files[key] as UploadedFile;

    if (!image.mimetype.startsWith('image')) {
      throw new BadRequestError('Please upload an image');
    }

    if (image.size >= this.maxImageSize) {
      throw new BadRequestError(
        `Please upload an image smaller than ${this.maxImageSize / (1024 * 1024)} MB`,
      );
    }

    const result = await cloudinary.uploader.upload(image.tempFilePath, {
      use_filename: true,
      folder: this.getFolder(folder),
    });

    await fs.unlink(image.tempFilePath);

    return this.formatUploadResult(result);
  }

  async deleteImage(imageId: string): Promise<void> {
    await cloudinary.uploader.destroy(imageId);
  }

  private formatUploadResult(result: UploadApiResponse): UploadResult {
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  }
}
