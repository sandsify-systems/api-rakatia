import { type Response } from 'express';
import { log } from './logger';

interface CustomObj<T = any> {
	[key: string]: T;
}

export interface IResMsg {
	(
		message: string,
		data: CustomObj | null,
		res: Response,
		statusCode: number,
		status?: string
	): void
}

const resMsg = (
	message: string,
	data: CustomObj | null,
	res: Response,
	statusCode = 200,
	status:string = 'successful'
) => {
	log.info(message);
	res.status(statusCode).json({
		status,
		message,
		data,
	});
}

export default resMsg
