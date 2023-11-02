import * as dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ICloudinary, ICloudinaryOptions } from './cloudinary.types';

import { log } from '../utils/logger';
import { Exception } from '../utils/errorhandler';
import * as fs from 'fs';

const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRETE } = process.env;

class CloudinaryClient implements ICloudinary {
  constructor() {
    cloudinary.config({
      cloud_name: CLOUDINARY_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRETE,
    });
  }

  /**
   * Upload file
   * @param filePath
   * @returns UploadApiResponse
   */
  async upload(filePath: string, cloudinaryFolder:string): Promise<UploadApiResponse> {
    log.info('::: file upload in progress...');
    try {
      const options: ICloudinaryOptions = {
        folder: cloudinaryFolder,
        use_filename: true,
      };
      const response: UploadApiResponse = await cloudinary.uploader.upload(filePath, options);
      log.info(':::: file uploaded successfully');
      return response;
    } catch (error) {
      log.error('Error occured while uploading file to cloudinary', error);
      throw new Exception('Internal server error occured during file upload', 500);
    }
  };

  /**
   * Get uploaded file
   * @param fileId
   * @returns UploadApiResponse
   */
  async getUploadedFile(fileId: string): Promise<UploadApiResponse> {
    try {
      return await cloudinary.api.resources([fileId]);
    } catch (error) {
      log.error('Error occured while deleting an asset', error);
      throw new Exception('Internal server error occured while retrieving uploaded file from cloudinary', 500);
    }
  };

  /**
 * Delete files from Cloudinary.
 * Expects an array of public_ids
 * @param {<array>} file ids  
 */
  async cloudinaryDelete(files: string[]) {
    log.info(':::: Deleteing uploaded file from cloudinary in progress...');
    try {
      return await cloudinary.api.delete_resources(files, {}, async (err: any, res: any) => {
        if (err) {
          log.error('Error occured while deleting an asset', err);
          throw new Exception('Internal server error occured while deleting an asset from cloudinary', 500);
        }
        log.info(':::: File deleted successfully...', res);
        return res;
      });
    } catch (err) {
      log.error('Error occured while deleting file from cloudinary', err);
      throw new Exception('Internal server error occured while deleting an asset from cloudinary', 500);
    }
  }

  validateImage(extention: string, fileSize: number): void {
    const validateImage = /(\.jpg|\.jpeg|\.png|\.gif|\.pdf)$/i;
    const fileSizeLimit: number = 5 * 1024 * 1024; //5mb in bytes
    if (!validateImage.exec(extention)) {
      log.error({ Error: 'Invalid file format, must be image' });
      throw new Exception('Invalid file format, must be image', 402);
    }
    if (fileSize > fileSizeLimit) {
      throw new Exception('File size exceeds 5mb limit', 402);
    }
  };

  deleteTempUploads(file: string): void {
    try {
      fs.stat(file, (error, stats) => {
        if (error) throw error;
        fs.unlink(file, (error) => {
          if (error) throw error;
          log.info(`file deleted successfully:--`, file);
        });
      });
    } catch (err) {
      log.error('Error occured while deleting uploaded file',);
      throw err;
    }
  };
};

export default CloudinaryClient;