import { ICompany } from "../../../core/database/models/company/company.model";
import { Request, Response, NextFunction } from "express";
import { IUpload } from "../../common/common.dto";

export interface ICompanyService {
	createCompany(data: ICompanySignUp): Promise<comapnySubset>
}

export interface ICompanyController {
	createCompany(req: Request, res: Response, next: NextFunction): void
}

export interface ICompanyHelper {
	getCompanySubset(company: ICompany): comapnySubset
	companyExist(email: string): void
	companyDoesNotExist(companyProperty: string): void
}

export interface ICompanySignUp {
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
	'phoneNumber' |
	'logoUrl' |
	'logoPublicId' |
	'address' |
	'website' |
	'industry' |
	'_id'
>