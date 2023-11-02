import {
	IUserService,
	userSubset,
	IUserSignUp,
	IUserSignIn,
	IAccessToken,
	IVerifyAccount,
	IUserEmail,
	IUpdatePassword,
} from './dto/user.dto';
import { Exception } from '../../core/utils';
import { UserModelType } from '../../core/database/models/user/user.model';
import UserHelper from './helper';
import { CompanyModelType } from '../../core/database/models/company/company.model';

export default class UserService extends UserHelper implements IUserService {

	constructor(user: UserModelType, company: CompanyModelType) {
		super(user, company);
	}

	/**
	 * User signup service 
	 * @param data 
	 * @returns userSubset
	 */
	async signUp(data: IUserSignUp): Promise<userSubset> {
		try {
			const { email, password, firstName, lastName, phoneNumber, profileImage } = data;
			let user = await this.user.findOne({ email: email });

			//check if user with the provided email already exist
			if (user) { throw this.userExist(email) };

			const name = `${firstName} ${lastName}`;
			const userData: any = { name, email, password, phoneNumber };
			if (profileImage) {
				const { public_id, secure_url } = await this.uploadToCloudinary(profileImage, 'profile_image');
				userData.imagePublicId = public_id;
				userData.imageUrl = secure_url
			}
			const $user = await new this.user(userData).save();

			// send user email verification
			this.sendVerificationLink($user, 'Verify account');

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
				throw this.userDoesNotExist(email);
			}

			// If non verified user try to signin throw error and resend new verification link
			if (user && !user.isVerified) {
				this.sendVerificationLink(user, 'Verify account');
				throw new Exception(
					'The account associated with this email is not verified. Please check your email for a new verification link',
					404
				)
			}

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
	* @returns userId
	*/
	public async verifyAccount(data: IVerifyAccount): Promise<{ userId: string }> {
		try {
			let { userId, code } = data;
			const user = await this.user.findOne({ _id: userId });

			if (!user) {
				throw this.userDoesNotExist(userId);
			}

			if (user.isVerified) {
				throw new Exception('Account already verified please proceed to login', 404);
			}

			const verificationCode: string = this.extractCode(user.code);
			const codeExpiryDate: string = this.extractCodeExpiry(user.code);
			if (this.isCodeExpired(codeExpiryDate)) {
				// Resend verification link
				this.sendVerificationLink(user, 'Verify account');
				throw new Exception('verification link has expired please check your email for a new link', 404);
			}

			// Compare the provided code with the user code
			if (code !== verificationCode) {
				throw new Exception('The verification code provided is not valid', 404);
			}
			// updated user status to verified
			await this.updateUser({ _id: userId }, { isVerified: true });

			// Send welcome email to user after successful account verification
			const { APP_URL } = process.env;
			let testTemaplate = `<div><a href=${APP_URL}/login>Account averified please proceed to login</a></div>`;
			await this.sendNoTification(user.email, 'Welcome to rakatia', testTemaplate);

			return { userId: user._id };
		} catch (err) {
			throw this.handleError(err);
		}
	}

	/**
	 * reset  password service
	 *  @param email
	 * @returns
	*/
	public async resetPassword(data: IUserEmail): Promise<void> {
		try {
			const { email } = data;
			const user = await this.user.findOne({ email: email });

			if (!user) {
				throw this.userDoesNotExist(email);
			}

			// send reset code
			this.sendVerificationLink(user, 'Reset password');
		} catch (err) {
			throw this.handleError(err);
		}
	}

	/**
	 * update password service
	 * @param data
	 * @returns 
	 */
	public async updatePassword(data: IUpdatePassword): Promise<void> {
		try {
			let { userId, code, newPassword } = data;
			const user = await this.user.findOne({ _id: userId });

			if (!user) {
				throw this.userDoesNotExist(userId);
			}

			const verificationCode: string = this.extractCode(user.code);
			const codeExpiryDate: string = this.extractCodeExpiry(user.code);
			if (this.isCodeExpired(codeExpiryDate)) {
				// Resend passsword reset link
				this.sendVerificationLink(user, 'Reset password');
				throw new Exception('Link expired, a new password reset link has been sent to your email', 404);
			}

			// Compare the provided code with the user code
			if (code !== verificationCode) {
				throw new Exception('Invalid password reset code', 404);
			}
			// updated user status to verified
			newPassword = await this.hashPassword(newPassword);
			await this.updateUser({ _id: userId }, { password: newPassword });

		} catch (err) {
			throw this.handleError(err);
		}
	}
}
