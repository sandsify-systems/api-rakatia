import { check } from 'express-validator';

export const createCompanyValidation = [
	check('ownersId').isString().notEmpty().withMessage('company owner\'s id is required'),
	check('name').isString().notEmpty().withMessage('company name  is required'),
	check('address').isString().optional(),
	check('email')
		.isEmail()
		.withMessage('email is not a valid email')
		.optional(),
	check('phoneNumber')
		.isString()
		.isLength({ min: 11, max: 14 })
		.withMessage('phone number must be min of 11 or max of 14 didgits')
		.optional(),
	check('website').isString().optional().isURL().withMessage('Company website must be a valid url e.g: https://company-name.com'),
	check('industry').isString().optional()
];

export const sendInvitationValidation = [
	check('sendersId').isString().notEmpty().withMessage('senders id is required'),
	check('companyId').isString().notEmpty().withMessage('company id is required'),
	check('inviteeEmail')
		.isEmail()
		.withMessage('email is not a valid email')
		.notEmpty()
		.withMessage('email is required'),
	check('role').isString().notEmpty().withMessage('role  is required')
	.isIn(['staff', 'admin', 'super-admin', 'manager']).withMessage('role must be on of this [ staff, admin, super-admin, manager ]'),
];

export const acceptInvitationValidation = [
	check('invitationId').isString().notEmpty().withMessage('invitationId is required'),
];