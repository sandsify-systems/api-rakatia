import { check, param } from 'express-validator';

export const signUpValidation = [
	check('firstName').isString().optional(),
	check('lastName').isString().optional(),
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
		.isLength({ min: 11, max: 14 })
		.withMessage('phone number must be min of 11 or max of 14 didgits')
		.optional(),
	check('invitationId')
		.isString()
		.optional()
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

export const getUser = [
]

export const updateUserValidation = [
	check('firstName').isString().optional(),
	check('lastName').isString().optional(),
	check('phoneNumber')
		.isString()
		.isLength({ min: 11, max: 14 })
		.withMessage('phone number must be min of 11 or max of 14 didgits')
		.optional()
];