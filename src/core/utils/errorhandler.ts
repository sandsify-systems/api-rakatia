import { type Request, type Response, type NextFunction } from 'express';

export class Exception extends Error {
	status: number;

	constructor(message: string, status: number) {
		super();
		this.message = message;
		this.status = status;
	}
}

export const handleErrors = (
	err: Exception,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const statusCode = err instanceof Exception ? err.status : 500;
	res.status(statusCode).json({
		status: 'error',
		statusCode,
		message: err.message,
		data: null,
	});
}
