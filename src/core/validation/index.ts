import { type Request, type Response, type NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Exception } from '../utils';
import { log } from '../utils';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const Errors = errors
			.array()
			.map((err) => ({ [err.param]: err.msg as string }));
		const errMessages = Errors.map((obj) => Object.values(obj).join(' ')).join(', ');
		log.error(errMessages);
		throw new Exception(errMessages, 422);
	}
	next();
}
export default validateRequest;
