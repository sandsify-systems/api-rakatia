import { FileArray } from "express-fileupload"
import { IUser } from "../../../core/database/models/user/user.model"
import { Request, Response, NextFunction } from "express"
import { UploadApiResponse } from "cloudinary"

export interface IUserService {
	signUp(data: IUserSignUp, imageFile: FileArray): Promise<userSubset>
	signIn(data: IUserSignIn): Promise<IAccessToken>
	verifyAccount(data: IVerifyAccount): Promise<{ userId: string }>
	resetPassword(data: IUserEmail): Promise<void>
	updatePassword(data: IUpdatePassword): Promise<void>
}

export interface IUserController {
	signUp(req: Request, res: Response, next: NextFunction): void
	signIn(req: Request, res: Response, next: NextFunction): void
	verifyAccount(req: Request, res: Response, next: NextFunction): void
	updatePassword(req: Request, res: Response, next: NextFunction): void
	resetPassword(req: Request, res: Response, next: NextFunction): void
}

export interface IUserHelper {
	hashPassword(password: string): Promise<string>
	comparePassword(password: string, hashedPassword: string): Promise<void>
	generateAccessToken(data: userSubset): IAccessToken
	createCode(): string
	extractCodeExpiry(code: string): string
	extractCode(code: string): string
	isCodeExpired(codeExpiryDate: string): boolean
	userExist(email: string): void
	userDoesNotExist(userProperty: string): void
	createShortId(): string
	createVerificationUrl(userId: string, code: string, path: string): Promise<string>
	getUserSubset(user: IUser): userSubset
	sendVerificationLink(user: IUser, subject: string): void
	handleError(err: any): void
	uploadProfileImage(upload: FileArray): Promise<UploadApiResponse>
	updateUser(params: Dictionary, data: userSubset): void
	sendNoTification(reciever: string, subject: string, template: string): Promise<void>
}

export interface IUserSignUp {
	firstName: string
	lastName: string
	email: string
	password: string
	phoneNumber: string
	roleType: string
}

export interface IUserSignIn {
	email: string
	password: string
	phoneNumber?: string
}

export type userSubset = Pick<
	IUser,
	'firstName' |
	'lastName' |
	'email' |
	'phoneNumber' |
	'imageUrl' |
	'imagePublicId' |
	'role' |
	'_id'
>

export interface IAccessToken {
	token: string;
}

export interface IVerifyAccount {
	userId: string
	code: string
}

export interface IUserId {
	userId: string
}

export interface IUserEmail {
	email: string
}

export interface IUpdatePassword {
	userId: string,
	code: string
	newPassword: string
}

export interface Dictionary<T = any> {
	[key: string]: T
}