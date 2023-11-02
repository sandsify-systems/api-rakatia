import { ICloudinary } from '../../core/cloudinary/cloudinary.types';
import CloudinaryClient from '../../core/cloudinary/cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { ICommonHelper, IUpload } from './common.dto';
import { UploadedFile } from 'express-fileupload';
import { Exception, log } from '../../core/utils';
import path from 'path';
import { sendEmail } from '../../core/utils/mailer';
import moment from 'moment';
import * as shortid from 'shortid';
import { IUser } from '../../core/database/models/user/user.model';

export default class CommonHelper implements ICommonHelper {
    cloudinaryClient: ICloudinary
    sendEmail

    constructor() {
        this.cloudinaryClient = new CloudinaryClient();
        this.sendEmail = sendEmail;
    }

    createCode(): string {
        const code: string = shortid.generate().replace('_', '');
        const expiry = moment(new Date(), "YYYY-MM-DD HH:mm:ss").add(1, 'month').format("YYYY-MM-DD HH:mm:ss");
        return `${code}|${expiry}`;
    };

    extractCode(code: string): string { return code.split('|')[0]; };

    extractCodeExpiry(code: string): string { return code.split('|')[1] };

    isCodeExpired(codeExpiryDate: string): boolean {
        const currentTime = moment(new Date(), "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
        return moment(codeExpiryDate).isBefore(currentTime);
    };

    async 	createVerificationUrl(user: IUser, code: string, path: string): Promise<string> {
        /**
         * check if the current code has expired before attaching to link
         * If code has expired create a new one and update user data
        */
        let verificationCode;
        const userId = user._id;
        let codeExpiryDate = this.extractCodeExpiry(code)
        if (this.isCodeExpired(codeExpiryDate)) {
            verificationCode = this.createCode();
            await user.updateOne({ _id: userId }, { code: verificationCode })
        } else {
            verificationCode = code;
        }
        const { app_url } = process.env;
        return `${app_url}/${path}/${userId}_${this.createShortId()}_${this.extractCode(verificationCode)}_${this.createShortId()}`;
    }

    async sendVerificationLink(user: IUser, subject: string): Promise<void> {
        // send user email verification
        const { _id, code, email } = user;
        let link = await this.createVerificationUrl(_id, code, 'verify');
        let testTemaplate = `<div><a href=${link}>${subject}</a></div>`;
        await this.sendNoTification(email, subject, testTemaplate);
    }

    createShortId(): string {
        let id = shortid.generate();
        return id.replace('-', '');
    }

    handleError(err: any): void {
        log.error(err);
        const message = err.message ? err.message : 'Internal server error';
        const status = err.status ? err.status : 500;
        throw new Exception(message, status);
    }

    async getUploadedFile(upload: UploadedFile): Promise<IUpload> {
        const uploadPth: string = path.join(__dirname, `../../../uploads/${upload.name}`);
        // move uploaded file from temp memory storage to "uploads dir"
        await upload.mv(uploadPth);

        return {
            name: upload.name,
            size: upload.size
        }
    }

    // Upload file to cloudinary
    async uploadToCloudinary(upload: IUpload, cloudinaryFolder: string): Promise<UploadApiResponse> {
        const ext: string = path.extname(upload.name);
        // validate uploaded file
        this.cloudinaryClient.validateImage(ext, upload.size);

        const uploadPth: string = path.join(__dirname, `../../../uploads/${upload.name}`);
        const imageUploadRes: UploadApiResponse = await this.cloudinaryClient.upload(uploadPth, cloudinaryFolder);

        // delete the uploaded image from the "uploads dir" after successful upload to cloudinary
        this.cloudinaryClient.deleteTempUploads(uploadPth);
        return imageUploadRes;
    }

    async sendNoTification(reciever: string, subject: string, template: string): Promise<void> {
        const data = {
            to: reciever,
            subject: subject,
            html: template
        }
        await this.sendEmail(data);
    }
}
