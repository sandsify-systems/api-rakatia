import { check } from 'express-validator';

export const companySignUpValidation = [
	check('name').isString().notEmpty().withMessage('company name  is required'),
	check('address').isString().notEmpty().withMessage('company address is required'),
	check('email')
		.isEmail()
		.withMessage('email is not a valid email')
		.notEmpty()
		.withMessage('email is required'),
	check('phoneNumber')
		.isString()
		.notEmpty()
		.withMessage('phoneNumber is required')
		.isLength({ min: 11, max: 14 })
		.withMessage('phone number must be min of 11 or max of 14 didgits'),
	check('website').isString().optional().isURL().withMessage('Company website must be a valid url e.g: https://company-name.com'),
	check('industry').isString().optional()
];