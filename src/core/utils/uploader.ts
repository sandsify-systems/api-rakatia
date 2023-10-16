// import { FileArray } from 'express-fileupload';
import { log } from './logger';
import { Exception } from './errorhandler';
import * as fs from 'fs';

export const validateUpload = (extention: string, fileSize: number): void => {
    const validateImage = /(\.jpg|\.jpeg|\.png|\.gif|\.pdf)$/i;
    const fileSizeLimit: number = 5 * 1024 * 1024; //5mb in bytes
    if (!validateImage.exec(extention)) {
        log.error({ Error: 'Invalid file format, must be image or pdf formart' });
        throw new Exception('Invalid file format, must be image or pdf formart', 400);
    }
    if (fileSize > fileSizeLimit) {
        throw new Exception('File size exceeds 5mb limit', 400);
    }
};

export const deleteTempUploads = (file: string): void => {
    try {
        fs.stat(file, (error, stats) => {
            if (error) throw error;
            fs.unlink(file, (error) => {
                if (error) throw error;
                log.info(`file deleted successfully:--`, file);
            });
        });
    } catch (err) {
        log.error('Error occured while deleting uploaded file', );
        throw err;
    }
};


// Upload files
// export const uploadFile = async (upload: FileArray): Promise<UploadApiResponse> => {
//     const uploadedFile = <UploadedFile>upload.preApprovalLetter;
//     const ext: string = path.extname(uploadedFile.name);
//     // validate uploaded file
//     validateUpload(ext, uploadedFile.size);
//     const uploadPth: string = path.join(__dirname, `../../../files/${uploadedFile.name}`);
//     // move uploaded file from temp memory storage to "files dir"
//     await uploadedFile.mv(uploadPth);
//     const response: UploadApiResponse = await new Cloudinary().upload(uploadPth);
//     // delete the uploaded image from the codebase after successful upload to cloudinary
//     deleteTempUploads(uploadPth);
//     return response;
// }
