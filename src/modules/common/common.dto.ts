import { UploadApiResponse } from "cloudinary"
import { UploadedFile } from "express-fileupload"
import { IUser } from "../../core/database/models/user/user.model"

export interface ICommonHelper {
	createCode(): string
	extractCodeExpiry(code: string): string
	extractCode(code: string): string
	isCodeExpired(codeExpiryDate: string): boolean
	createTemplateUrl(db: any, path: string): Promise<string>
	createEmailTemplate(templateData: Dictionary, template: string): Promise<string>
	sendNoTification(notificationData: INotification): Promise<void>
	createShortId(): string
	handleError(err: any): void
	getUploadedFile(upload: UploadedFile): Promise<IUpload>
	uploadToCloudinary(upload: IUpload, cloudinaryFolder: string): Promise<UploadApiResponse>
}

export interface Dictionary<T = any> {
	[key: string]: T
}

export interface IUpload {
	name: string;
	size: number
}

export interface INotification {
	db: any
	reciever: string
	subject: string
	template: string
	templateData: Dictionary
	redirectPath?: string
}