import { check } from 'express-validator';

export const signUpValidation = [
	check('firstName').isString().notEmpty().withMessage('firstName is required'),
	check('lastName').isString().notEmpty().withMessage('lastName is required'),
	check('email')
		.isEmail()
		.withMessage('email is not a valid email')
		.notEmpty()
		.withMessage('email is required'),
	check('password')
		.isString()
		.notEmpty()
		.isLength({ min: 8 })
		.withMessage('password is required and minimum of 8 characters'),
	check('phoneNumber')
		.isString()
		.notEmpty()
		.withMessage('phoneNumber is required')
		.isLength({ min: 11, max: 14 })
		.withMessage('phone number must be min of 11 or max of 14 didgits'),
	// check('roleType')
	// 	.isString()
	// 	.optional()
	// 	.isIn(['staff', 'admin', 'manager'])
	// 	.withMessage('role must be one of "staff","admin","manager"')
];

export const signInValidation = [
	check('email')
		.isEmail()
		.withMessage('email is not a valid email')
		.notEmpty()
		.withMessage('email is required'),
	// check('phoneNumber')
	// 	.optional()
	// 	.isString()
	// 	.withMessage('phoneNumber should be a string'),
	check('password').isString().notEmpty().withMessage('password is required'),
];

export const verifyValidation = [
	check('userId').isString().notEmpty().withMessage('user id is required').withMessage('user id must be a string'),
	check('code').isString().notEmpty().withMessage('verification code is required'),
];

export const resetPassword = [
	check('email')
		.isEmail()
		.withMessage('email is not a valid email')
		.notEmpty()
		.withMessage('email is required'),
];

export const updatePassword = [
	check('userId').isString().notEmpty().withMessage('user id is required').withMessage('user id must be a string'),
	check('code').isString().notEmpty().withMessage('verification code is required'),
	check('newPassword').isString().notEmpty().withMessage('verification code is required'),
];