import { UploadApiResponse } from 'cloudinary';

export interface ICloudinary {
  upload(imagePath: string, cloudinaryFolder: string): Promise<UploadApiResponse>
  getUploadedFile(imageId: string): Promise<UploadApiResponse>
  cloudinaryDelete(files: string[]): Promise<any>
  validateImage(extention: string, fileSize: number): void
  deleteTempUploads(file: string): void
}

export interface ICloudinaryOptions {
  folder: string;
  use_filename: boolean;
}
