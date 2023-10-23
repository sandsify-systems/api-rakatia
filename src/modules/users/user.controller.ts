import { type NextFunction, type Request, type Response } from 'express';
import { IResMsg } from '../../core/utils/response';
// import { FileArray } from 'express-fileupload';
import { IUserController, IUserService } from './dto/service.dto';
import { FileArray } from 'express-fileupload';


export default class UserController implements IUserController {
	userService: IUserService;
	resMsg: IResMsg;

	constructor(userService: IUserService, resMsg: IResMsg) {
		this.userService = userService;
		this.resMsg = resMsg;
	}

	async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const imageFile = req.files as FileArray;
			const data = await this.userService.signUp(req.body, imageFile);
			this.resMsg('User account created successfully', data, res, 200);
		} catch (error: any) {
			next(error);
		}
	}

	async signIn(req: Request, res: Response, next: NextFunction):Promise<void>{
		try {
			const data = await this.userService.signIn(req.body)
			this.resMsg('User signin successful', data, res, 200)
		} catch (error) {
			next(error)
		}
	}

	async verifyAccount(req: Request, res: Response, next: NextFunction):Promise<void>{
		try {
			const data = await this.userService.verifyAccount(req.body)
			this.resMsg('User verification successful', data, res, 200)
		} catch (error) {
			next(error)
		}
	}
}
