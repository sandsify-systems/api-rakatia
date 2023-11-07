import { ICompany } from "../../../core/database/models/company/company.model";
import { Request, Response, NextFunction } from "express";
import { Dictionary, IUpload } from "../../common/common.dto";
import { Types } from 'mongoose';
import { Iinvitations } from "../../../core/database/models/invitations/invitations.model";
import { IUser } from "../../../core/database/models/user/user.model";

export interface ICompanyService {
	createCompany(data: ICompanySignUp): Promise<comapnySubset>
	sendInvitation(data: ISendInvitation): Promise<void>
	acceptInvitation(data: IAcceptInvitation): Promise<void>
}

export interface ICompanyController {
	createCompany(req: Request, res: Response, next: NextFunction): void
	sendInvitation(req: Request, res: Response, next: NextFunction): void
	acceptInvitation(req: Request, res: Response, next: NextFunction): void
}

export interface ICompanyHelper {
	getCompanySubset(company: ICompany): comapnySubset
	companyExist(message: string): void
	companyDoesNotExist(message: string): void
	acceptInvite(data: Dictionary): Promise<void>
	validateInvitation(invite: Iinvitations | null): Iinvitations
}

export interface ICompanySignUp {
	ownersId: Types.ObjectId
	name: string
	email: string
	address: string
	phoneNumber: string
	website?: string
	industry?: string
	logo?: IUpload | null
}

export type comapnySubset = Pick<
	ICompany,
	'name' |
	'email' |
	'ownersId' |
	'phoneNumber' |
	'logoUrl' |
	'logoPublicId' |
	'address' |
	'website' |
	'industry' |
	'_id'
>

export interface ISendInvitation {
	sendersId: Types.ObjectId
	companyId: Types.ObjectId
	inviteeEmail: string
	role: string
}

export interface IAcceptInvitation {
	invitee:IUser
	company:ICompany
	invitationId:Types.ObjectId 
	reciever:string, 
	role: string
}