import { type NextFunction, type Request, type Response } from 'express';
import { IResMsg } from '../../core/utils/response';
import { ICompanyController, ICompanyService } from './dto/company.dto';
import { UploadedFile } from 'express-fileupload';
import { ICommonHelper } from '../common/common.dto';
import CommonHelper from '../common';


export default class CompanyController implements ICompanyController {
	helper: ICommonHelper;

	constructor(protected companyService: ICompanyService, protected resMsg: IResMsg) {
		this.companyService = companyService;
		this.resMsg = resMsg;
		this.helper = new CommonHelper();
	}

	async createCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			let upload = req.files
			const companyLogo = upload?.logo ? await this.helper.getUploadedFile(<UploadedFile>upload?.logo) : null;
			let payload = req.body;
			payload.logo = companyLogo;
			const data = await this.companyService.createCompany(payload);
			this.resMsg('Company account created successfully', data, res, 200);
		} catch (error: any) {
			next(error);
		}
	}
}