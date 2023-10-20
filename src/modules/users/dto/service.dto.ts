import { FileArray } from "express-fileupload"
import { IUser } from "../../../core/database/models/user/user.model"
import { Request, Response, NextFunction } from "express"

export interface IUserService {
	signUp(data: IUserSignUp, imageFile: FileArray): Promise<userSubset>
	signIn(data: IUserSignIn): Promise<IAccessToken>
}

export interface IUserController {
	signUp(req: Request, res: Response, next: NextFunction): void
	signIn(req: Request, res: Response, next: NextFunction): void
}

export interface IUserHelper {
	hashPassword(password: string): Promise<string>
	comparePassword(password: string, hashedPassword: string): Promise<void>
	generateAccessToken(data: userSubset): IAccessToken
	createCode(): string
	getCodeExpiry(code: string): string
	extractCode(code: string): string
	isCodeExpired(codeExpiryDate: string): boolean
	doesUserExist(user: IUser | null, email: string): void
	createShortId(): string
	createVerificationUrl(userId: string, code: string, path: string): Promise<string>
	getUserSubset(user: IUser): userSubset
	sendVerificationLink(user: IUser): void
	handleError(err:any):void
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