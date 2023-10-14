import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Exception } from '../../../core/utils';
import moment from 'moment';
import * as shortid from 'shortid';
import { IUser } from '../../../core/database/models/user/user.model';

interface IAccessToken {
	id: string;
	email: string;
}

export default class UserHelper {
	public static async hashPassword(password: string) {
		const hash = await bcryptjs.hash(password, 10);
		return hash;
	}

	public static async comparePassword(password: string, hashedPassword: string) {
		const verifiedPassword: boolean = await bcryptjs.compare(password, hashedPassword);

		if (!verifiedPassword) {
			throw new Exception('Invalid credentials. Please check your email and password and try again.', 400);
		}
	}

	public static generateAccessToken(data: IAccessToken): string {
		const token = jwt.sign(
			{ ...data, expireAt: '2hr' },
			process.env.JWT_SECRET as string
		);
		return token;
	}

	public static createCode = (): string => {
		const code: string = shortid.generate().replace('_', '');
		const expiry: string = moment(new Date()).add(1, 'month').format('YYYY-MM-DD HH:mm:ss');
		return `${code}|${expiry}`;
	};

	public static isCodeExpired = (codeExpiryDate: string): boolean => {
		const currentTime: string = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
		return moment(codeExpiryDate).isBefore(currentTime);
	};

	public static doesUserExist = (user: IUser | null, email:string): void => {
		if (user) {
			throw new Exception(`User with email: ${email} already exist`, 422);
		}
	}
}
