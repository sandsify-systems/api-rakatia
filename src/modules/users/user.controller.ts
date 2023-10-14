import { type NextFunction, type Request, type Response } from 'express';
import UserService from './user.service';
import resMsg from '../../core/utils/response';
import { FileArray } from 'express-fileupload';

const userService = new UserService();
export default class UserController {
	async signUp(req: Request, res: Response, next: NextFunction) {
		try {
			const upload = req.files as FileArray;
			const data = await userService.signUp(req.body, upload);
			resMsg('User account created successfully', data, res, 200);
		} catch (error: any) {
			next(error);
		}
	}
}
