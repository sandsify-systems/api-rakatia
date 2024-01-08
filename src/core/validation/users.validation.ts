import { check, param } from 'express-validator';

export const signUpValidation = [
	check('firstName').isString().optional(),
	check('lastName').isString().optional(),
	check('email')
		.notEmpty().withMessage('email is required')
		.isEmail().withMessage('the supplied email is not valid'),
	check('password')
		.notEmpty().withMessage('password is required')
		.isString().withMessage('password must be a string')
		.isLength({ min: 8 }).withMessage('password nust contain minimum of 8 characters'),
	check('phoneNumber')
		.isString()
		.isLength({ min: 11 })
		.withMessage('phone number must be min of 11 didgits')
		.isLength({ max: 14 })
		.withMessage('phone number must be max of 14 didgits')
		.optional(),
	check('invitationId')
		.isString()
		.optional()
];

export const signInValidation = [
	check('email').notEmpty().withMessage('email is required'),
	check('password').notEmpty().withMessage('password is required')
	// check('phoneNumber')
	// 	.optional()
	// 	.isString()
	// 	.withMessage('phoneNumber should be a string'),
];

export const verifyValidation = [
	check('userId').notEmpty().withMessage('user id is required'),
	check('code').notEmpty().withMessage('verification code is required'),
];

export const resetPassword = [
	check('email')
		.isEmail()
		.withMessage('email is not a valid email')
		.notEmpty()
		.withMessage('email is required'),
];

export const updatePassword = [
	check('userId')
		.isString().withMessage('user id must be a string')
		.notEmpty().withMessage('user id is required'),
	check('code')
	.isString().withMessage('code must be a string')
	.notEmpty().withMessage('verification code is required'),
	check('newPassword')
	.notEmpty().withMessage('new password is required'),
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