import {
	IUserService,
	userSubset,
	IUserSignUp,
	IUserSignIn,
	IAccessToken,
	IVerifyAccount,
} from './dto/service.dto';
import { Exception } from '../../core/utils';
import { FileArray } from 'express-fileupload';
import { RoleModelType } from '../../core/database/models/user/role.model';
import { UserModelType } from '../../core/database/models/user/user.model';
import UserHelper from './helper';
import { sendEmail } from '../../core/utils/mailer';

export default class UserService extends UserHelper implements IUserService {

	constructor(user: UserModelType, role: RoleModelType) {
		super(user, role);
	}

	/**
	 * User signup service 
	 * @param data 
	 * @param imageFile 
	 * @returns userSubset
	 */
	async signUp(data: IUserSignUp, imageFile: FileArray): Promise<userSubset> {
		try {
			const { email, roleType } = data;
			let user = await this.user.findOne({ email: email });

			//check if user with the provided email already exist
			this.doesUserExist(user, email);

			// default user role to staff if role type not present in request payload
			const userRole = roleType ? await this.role.findOne({ name: roleType }) :
				await this.role.findOne({ name: 'staff' });

			let userData: any = {
				...data,
				role: userRole
			}
			if (imageFile) {
				const { public_id, secure_url } = await this.uploadProfileImage(imageFile);
				userData.imagePublicId = public_id;
				userData.imageUrl = secure_url
			}
			const $user = await new this.user(userData).save();

			// send user email verification
			this.sendVerificationLink($user);

			return this.getUserSubset($user);
		} catch (err: any) {
			throw this.handleError(err);
		}
	}

	/**
	 * User signin service
	 * @param data 
	 * @returns AccessToken
	 */
	async signIn(data: IUserSignIn): Promise<IAccessToken> {
		try {
			const { email, password } = data;
			const user = await this.user.findOne({ email: email });

			if (!user) {
				throw new Exception(
					'User not found. There is no account associated with this email. Please proceed to the registration page to create a new account.',
					404
				);
			}

			// Non verified user tries to signin throw error and resend new verification link
			// if (user && !user.isVerified) {
			// 	this.sendVerificationLink(user);
			// 	throw new Exception(
			// 		'The account associated with this email is not verified. Please check your email for a new verification link',
			// 		404
			// 	)
			// } 

			await this.comparePassword(password, user.password);
			const accessToken = this.generateAccessToken(this.getUserSubset(user));
			return accessToken;
		} catch (err: any) {
			throw this.handleError(err);
		}
	}

	/**
	* verify user account service
	* @param data
	* @returns Boolean
	*/
	public async verifyAccount(data: IVerifyAccount): Promise<{userId:string}> {
		try {
			let { userId, code } = data;
			const user = await this.user.findOne({ id: userId });

			if (!user) {
				throw new Exception(`There's no user account associated with the provided user_id:- ${userId}`, 404);
			}

			if (user.isVerified) {
				throw new Exception('Account already verified please proceed to login', 404);
			}

			const verificationCode: string = this.extractCode(user.code);
			const codeExpiryDate: string = this.extractCodeExpiry(user.code);
			if (this.isCodeExpired(codeExpiryDate)) {
				// Resend verification link
				this.sendVerificationLink(user);
				throw new Exception('verification link has expired please check your email for a new link', 404);
			}

			// Compare the provided code with the user code
			if (code !== verificationCode) {
				throw new Exception('The verification code provided is not valid', 404);
			}
			// updated user status to verified
			await this.updateUser({ _id: userId }, { isVerified: true });

			// Send welcome email to user after successful account verification
			const {APP_URL} = process.env;
			let testTemaplate = `<div><a href=${APP_URL}/login>Account averified please proceed to login</a></div>`;
			await sendEmail(user.email, testTemaplate);

			return {userId:userId};
		} catch (err) {
			throw this.handleError(err);
		}
	}
}
