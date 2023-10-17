import { FileArray } from "express-fileupload"
import { IUser } from "../../../core/database/models/user/user.model"
import { Request, Response, NextFunction } from "express"

export interface IUserService {
	signUp(data: IUserSignUp, upload: FileArray): Promise<userSubset>
}

export interface IUserController {
	signUp(req: Request, res: Response, next: NextFunction):void
}

export interface IUserHelper {
	hashPassword(password: string):Promise<string>
	comparePassword(password: string, hashedPassword: string):Promise<void>
	generateAccessToken(data: IAccessToken): string
	createCode (): string
	getCodeExpiry(code: string): string
	extractCode(code: string): string
	isCodeExpired (codeExpiryDate: string): boolean
	doesUserExist(user: IUser | null, email: string): void
	createShortId(): string
	createVerificationUrl(userId: string, code: string, path: string): Promise<string>
	getUserSubset (user: IUser): userSubset
}

export interface IUserSignUp {
	firstName: string
	lastName: string
	email: string
	password: string
	phoneNumber: string
	roleType: string
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
	id: string;
	email: string;
}