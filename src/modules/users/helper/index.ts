import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Exception } from '../../../core/utils';
import moment from 'moment';
import * as shortid from 'shortid';
import { IUser } from '../../../core/database/models/user/user.model';
import { userSubset, IAccessToken, IUserHelper } from '../dto/service.dto';
import _ from 'lodash';
import { UserModelType } from "../../../core/database/models/user/user.model";
import { RoleModelType } from "../../../core/database/models/user/role.model";

export default class UserHelper implements IUserHelper {

	constructor(
		protected user: UserModelType,
		protected role: RoleModelType,
	) {
		this.user = user;
		this.role = role;
	}

	async hashPassword(password: string): Promise<string> {
		const hash = await bcryptjs.hash(password, 10);
		return hash;
	}

	async comparePassword(password: string, hashedPassword: string): Promise<void> {
		const verifiedPassword: boolean = await bcryptjs.compare(password, hashedPassword);

		if (!verifiedPassword) {
			throw new Exception('Invalid credentials. Please check your email and password and try again.', 400);
		}
	}

	generateAccessToken(data: IAccessToken): string {
		const token = jwt.sign(
			{ ...data, expireAt: '2hr' },
			process.env.JWT_SECRET as string
		);
		return token;
	}

	createCode(): string {
		const code: string = shortid.generate().replace('_', '');
		const expiry: string = moment(new Date()).add(1, 'month').format('YYYY-MM-DD HH:mm:ss');
		return `${code}|${expiry}`;
	};

	isCodeExpired(codeExpiryDate: string): boolean {
		const currentTime: string = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
		return moment(codeExpiryDate).isBefore(currentTime);
	};

	doesUserExist(user: IUser | null, email: string): void {
		if (user) {
			throw new Exception(`User with email: ${email} already exist`, 422);
		}
	}

	getUserSubset(user: IUser): userSubset {
		const pick = _.pick(user, [
			'firstName',
			'lastName',
			'email',
			'phoneNumber',
			'imageUrl',
			'imagePublicId',
			'role',
			'_id'
		]);
		return pick;
	}
}
