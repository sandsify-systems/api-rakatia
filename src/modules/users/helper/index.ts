import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Exception } from '../../../core/utils';
import { IUser } from '../../../core/database/models/user/user.model';
import {
	userSubset,
	IAccessToken,
	IUserHelper,
	Dictionary
} from '../dto/user.dto';
import _ from 'lodash';
import { UserModelType } from "../../../core/database/models/user/user.model";
import CommonHelper from '../../common';
import { CompanyModelType } from '../../../core/database/models/company/company.model';

export default class UserHelper extends CommonHelper implements IUserHelper {

	constructor(protected user: UserModelType, protected company: CompanyModelType) {
		super();
		this.user = user;
		this.company = company;
	}

	async hashPassword(password: string): Promise<string> {
		const hash = await bcryptjs.hash(password, 10);
		return hash;
	}

	async comparePassword(password: string, hashedPassword: string): Promise<void> {
		const verifiedPassword: boolean = await bcryptjs.compare(password, hashedPassword);

		if (!verifiedPassword) {
			throw new Exception('Invalid credentials. Please check your email and password and try again.', 404);
		}
	}

	generateAccessToken(data: userSubset): IAccessToken {
		const token = jwt.sign(
			{ ...data, expireAt: '24hr' },
			process.env.JWT_SECRET as string
		);
		return { token: token };
	}

	userExist(userProperty: string): void {
		throw new Exception(`User with property: ${userProperty} already exist`, 422);
	}

	userDoesNotExist(userProperty: string): void {
		throw new Exception(
			`User not found. There's no account associated with this cred:${userProperty}. Please proceed to the registration page to create a new account.`,
			404
		);
	}

	getUserSubset(user: IUser): userSubset {
		const pick = _.pick(user, [
			'name',
			'email',
			'phoneNumber',
			'imageUrl',
			'imagePublicId',
			'_id'
		]);
		return pick;
	}

	async updateUser(params: Dictionary, data: Dictionary): Promise<void> {
		await this.user.updateOne(params, data);
	}
}
