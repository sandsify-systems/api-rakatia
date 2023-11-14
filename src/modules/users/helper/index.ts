import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Exception } from '../../../core/utils';
import { IUser } from '../../../core/database/models/user/user.model';
import {
	TypeUserSubset,
	IAccessToken,
	IUserHelper,
	Dictionary,
	IUserId,
	IUpdateUser,
} from '../dto/user.dto';
import _ from 'lodash';
import { UserModelType } from "../../../core/database/models/user/user.model";
import CommonHelper from '../../common';
import { CompanyModelType } from '../../../core/database/models/company/company.model';
import { Iinvitations } from '../../../core/database/models/invitations/invitations.model';

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

	generateAccessToken(data: { id: 'string' }): IAccessToken {
		const token = jwt.sign(
			{ ...data, expireAt: '24hr' },
			process.env.JWT_SECRET as string
		);
		return { token: token };
	}

	userExist(message: string): void {
		throw new Exception(message, 422);
	}

	userDoesNotExist(message: string): void {
		throw new Exception(message, 404);
	}

	getUserSubset(user: IUser): TypeUserSubset {
		const pick = _.pick(user, [
			'name',
			'email',
			'phoneNumber',
			'imageUrl',
			'imagePublicId',
			'_id',
			'roles'
		]);
		return pick;
	}

	async userUpdate(params: Dictionary, data: Dictionary): Promise<TypeUserSubset> {
		const user = await this.user.updateOne(params, data);
		return this.getUserSubset(await this.user.findOne(params));
	}
}
