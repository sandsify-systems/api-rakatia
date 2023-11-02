import { IUser } from "../../../core/database/models/user/user.model"
import { Request, Response, NextFunction } from "express"
import { IUpload } from "../../common/common.dto"

export interface IUserService {
	signUp(data: IUserSignUp): Promise<userSubset>
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
	userExist(email: string): void
	userDoesNotExist(userProperty: string): void
	getUserSubset(user: IUser): userSubset
	updateUser(params: Dictionary, data: userSubset): void
}

export interface IUserSignUp {
	firstName: string
	lastName: string
	email: string
	password: string
	phoneNumber: string
	profileImage?: IUpload | null
}

export interface IUserSignIn {
	email: string
	password: string
	phoneNumber?: string
}

export type userSubset = Pick<
	IUser,
	'name' |
	'email' |
	'phoneNumber' |
	'imageUrl' |
	'imagePublicId' |
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