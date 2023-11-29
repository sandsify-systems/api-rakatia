import { type NextFunction, type Response } from 'express';
import { IResMsg } from '../../core/utils/response';
import {
	ICompanyController,
	ICompanyService,
	IGetCompanyParams
} from './dto/company.dto';
import { UploadedFile } from 'express-fileupload';
import { ICommonHelper } from '../common/common.dto';
import CommonHelper from '../common';
import { CustomRequest } from '../../core/utils/authorizationMiddleWare';
import { param } from 'express-validator';


export default class CompanyController implements ICompanyController {
	helper: ICommonHelper;

	constructor(protected companyService: ICompanyService, protected resMsg: IResMsg) {
		this.companyService = companyService;
		this.resMsg = resMsg;
		this.helper = new CommonHelper();
	}

	async createCompany(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
		try {
			let upload = req.files
			const companyLogo = upload?.logo ? await this.helper.getUploadedFile(<UploadedFile>upload?.logo) : null;
			let payload = req.body;
			payload.logo = companyLogo;
			const data = await this.companyService.createCompany(payload);
			this.resMsg('Company created successfully', data, res, 200);
		} catch (error: any) {
			next(error);
		}
	}

	async sendInvitation(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
		try {
			await this.companyService.sendInvitation(req.body);
			this.resMsg('Invitation sent successfully', null, res, 200);
		} catch (error: any) {
			next(error);
		}
	}

	async acceptInvitation(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
		try {
			await this.companyService.acceptInvitation(req.body);
			this.resMsg('Invitation accepted successfully', null, res, 200);
		} catch (error: any) {
			next(error);
		}
	}

	async getCompany(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
		try {
			let params: IGetCompanyParams = { ownersId: req.token.id };
			if (req.query.companyId) params._id = req.query.companyId as string;
			const company = await this.companyService.getCompany(params);
			this.resMsg('Company retrieved successfully', company, res, 200);
		} catch (error) {
			next(error);
		}
	}

	async updateCompany(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
		try {
			let upload = req.files
			const logo = upload?.logo ? await this.helper.getUploadedFile(<UploadedFile>upload?.logo) : null;
			const { token, body } = req;
			const comapny = await this.companyService.updateCompany({ ...body, ownersId:token.id, logo });
			this.resMsg('Company data updated successfully', comapny, res, 200);
		} catch (error) {
			next(error);
		}
	}
}