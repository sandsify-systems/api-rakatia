import { type Response } from 'express'

const resMsg = (
	message: string,
	data: object,
	res: Response,
	statusCode = 200,
	status = 'success'
) =>
	res.status(statusCode).json({
		status,
		message,
		data,
	})

export default resMsg
