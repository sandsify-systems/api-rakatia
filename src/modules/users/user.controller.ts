import { type NextFunction, type Request, type Response } from 'express';
import { IResMsg } from '../../core/utils/response';
import { IUserController, IUserService } from './dto/user.dto';
import CommonHelper from '../common';
import { ICommonHelper } from '../common/common.dto';
import { UploadedFile } from 'express-fileupload';
import { CustomRequest } from '../../core/utils/authorizationMiddleWare';


export default class UserController implements IUserController {
	helper: ICommonHelper;

	constructor(protected userService: IUserService, protected resMsg: IResMsg) {
		this.userService = userService;
		this.resMsg = resMsg;
		this.helper = new CommonHelper();
	}

	async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			let upload = req.files;
			const profileImage = upload?.profileImage ? await this.helper.getUploadedFile(<UploadedFile>upload?.profileImage) : null;
			req.body.profileImage = profileImage;
			const data = await this.userService.signUp(req.body);
			this.resMsg('User account created successfully', data, res, 200);
		} catch (error: any) {
			next(error);
		}
	}

	async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const data = await this.userService.signIn(req.body);
			this.resMsg('User signin successful', data, res, 200);
		} catch (error) {
			next(error);
		}
	}

	async verifyAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const data = await this.userService.verifyAccount(req.body);
			this.resMsg('User verification successful', data, res, 200);
		} catch (error) {
			next(error);
		}
	}

	async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			await this.userService.resetPassword(req.body);
			this.resMsg('Password reset link has been sent to your email', null, res, 200);
		} catch (error) {
			next(error);
		}
	}

	async updatePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			await this.userService.updatePassword(req.body);
			this.resMsg('Password updated successfully', null, res, 200);
		} catch (error) {
			next(error);
		}
	}

	async getUser(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
		try {
			const user = await this.userService.getUser(req.token);
			this.resMsg('User retrieved successfully', user, res, 200);
		} catch (error) {
			next(error);
		}
	}

	async updateUser(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
		try {
			let upload = req.files;
			const profileImage = upload?.profileImage ? await this.helper.getUploadedFile(<UploadedFile>upload?.profileImage) : null;
			const { token, body } = req;
			const user = await this.userService.updateUser({ ...token, ...body, profileImage });
			this.resMsg('User updated successfully', user, res, 200);
		} catch (error) {
			next(error);
		}
	}
}