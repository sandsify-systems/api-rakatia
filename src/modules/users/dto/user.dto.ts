import { IUser } from "../../../core/database/models/user/user.model";
import { Request, Response, NextFunction } from "express";
import { IUpload } from "../../common/common.dto";
import { Types } from "mongoose";
import { ICompany } from "../../../core/database/models/company/company.model";

export interface IUserService {
	signUp(data: IUserSignUp): Promise<TypeUserSubset>
	createUser(userData: Dictionary, invitationId: string | null): Promise<IUser>
	signUpByInvitation(data: IUserSignUp): Promise<TypeUserSubset>
	signIn(data: IUserSignIn): Promise<IAccessToken>
	verifyAccount(data: IVerifyAccount): Promise<{ userId: string }>
	resetPassword(data: IUserEmail): Promise<void>
	updatePassword(data: IUpdatePassword): Promise<void>
	getUser(param: Dictionary): Promise<IGetUser>
	updateUser(data: IUpdateUser): Promise<TypeUserSubset>
}

export interface IUserController {
	signUp(req: Request, res: Response, next: NextFunction): void
	signIn(req: Request, res: Response, next: NextFunction): void
	verifyAccount(req: Request, res: Response, next: NextFunction): void
	resetPassword(req: Request, res: Response, next: NextFunction): void
	updatePassword(req: Request, res: Response, next: NextFunction): void
	getUser(req: Request, res: Response, next: NextFunction): void
	updateUser(req: Request, res: Response, next: NextFunction): void
}

export interface IUserHelper {
	hashPassword(password: string): Promise<string>
	comparePassword(password: string, hashedPassword: string): Promise<void>
	generateAccessToken(data: { id: string }): IAccessToken
	userExist(message: string): void
	userDoesNotExist(message: string): void
	getUserSubset(user: IUser): TypeUserSubset
	userUpdate(params: Dictionary, data: TypeUserSubset): void
}

export interface IUserSignUp {
	firstName?: string
	lastName?: string
	email: string
	password: string
	phoneNumber?: string
	profileImage?: IUpload | null
	invitationId?: string
}

export interface IUpdateUser {
	id: Types.ObjectId,
	firstName?: string
	lastName?: string
	phoneNumber?: string
	profileImage?: IUpload | null
}

export interface IGetUser {
	user: TypeUserSubset,
	companiesOwnedByUser: ICompany[]
}

export interface IUserSignIn {
	email: string
	password: string
	phoneNumber?: string
}

export type TypeUserSubset = Pick<
	IUser,
	'name' |
	'email' |
	'phoneNumber' |
	'imageUrl' |
	'imagePublicId' |
	'_id' |
	'roles'
>

export interface IAccessToken {
	token: string;
}

export interface IDecodedToken {
	id: string;
}

export interface IVerifyAccount {
	userId: Types.ObjectId,
	code: string
}

export interface IUserId {
	userId: string
}

export interface IUserEmail {
	email: string
}

export interface IUpdatePassword {
	userId: Types.ObjectId,
	code: string
	newPassword: string
}

export interface Dictionary<T = any> {
	[key: string]: T
}