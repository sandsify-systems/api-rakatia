import { UploadApiResponse } from "cloudinary"
import { UploadedFile } from "express-fileupload"
import { IUser } from "../../core/database/models/user/user.model"

export interface ICommonHelper {
	createCode(): string
	extractCodeExpiry(code: string): string
	extractCode(code: string): string
	isCodeExpired(codeExpiryDate: string): boolean
	createVerificationUrl(user: IUser, code: string, path: string): Promise<string>
	sendVerificationLink(user: IUser, subject: string): void
	createShortId(): string
	handleError(err: any): void
	getUploadedFile(upload: UploadedFile): Promise<IUpload>
	uploadToCloudinary(upload: IUpload, cloudinaryFolder: string): Promise<UploadApiResponse>
	sendNoTification(reciever: string, subject: string, template: string): Promise<void>
}

export interface Dictionary<T = any> {
	[key: string]: T
}

export interface IUpload {
	name: string;
	size: number
}