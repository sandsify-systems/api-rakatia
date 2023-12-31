import { ICloudinary } from '../../core/cloudinary/cloudinary.types';
import CloudinaryClient from '../../core/cloudinary/cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { Dictionary, ICommonHelper, INotification, IUpload } from './common.dto';
import { UploadedFile } from 'express-fileupload';
import { Exception, log } from '../../core/utils';
import path from 'path';
import { MailOptions, sendEmail } from '../../core/notification/mailer';
import moment from 'moment';
import * as shortid from 'shortid';
import { IUser } from '../../core/database/models/user/user.model';
import { renderFile } from 'ejs';
import { Types } from 'mongoose';
import { ObjectId } from 'mongodb';

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

    validateID(id: Types.ObjectId) {
        if (!ObjectId.isValid(id)) {
            throw new Exception(`The given ID:- "${id}" is not a valid model ID fomart`, 422);
        }
    }

    async createTemplateUrl(db: any, redirectPath: string): Promise<string> {
        /**
         * check if the current code has expired before attaching to link
         * If code has expired create a new one and update user data
        */
        let verificationCode: string;
        const id = db._id;
        let codeExpiryDate = this.extractCodeExpiry(db.code)
        if (this.isCodeExpired(codeExpiryDate)) {
            verificationCode = this.createCode();
            await db.updateOne({ _id: id }, { code: verificationCode })
        } else {
            verificationCode = db.code;
        }
        const { App_url } = process.env;
        return `${App_url}/${redirectPath}/${id}_${this.createShortId()}_${this.extractCode(verificationCode)}_${this.createShortId()}`;
    }

    async createEmailTemplate(templateData: Dictionary, template: string): Promise<string> {
        const templatePath = path.join(__dirname, `../../core/notification/templates/${template}.ejs`);
        return await renderFile(templatePath, templateData);
    }

    async sendNoTification(notificationData: INotification): Promise<void> {
        const { db, reciever, redirectPath, template, templateData, subject } = notificationData;

        templateData.link = path ? await this.createTemplateUrl(db, redirectPath) : '#';
        let html = await this.createEmailTemplate(templateData, template);
        const mailData: MailOptions = {
            to: reciever,
            subject: subject,
            html: html
        }

        await this.sendEmail(mailData);
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
}
