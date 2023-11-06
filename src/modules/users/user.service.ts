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
import Invitations from '../../core/database/models/invitations/invitations.model';
import { InvitationsModelType } from '../../core/database/models/invitations/invitations.model';
import { INotification } from '../common/common.dto';

export default class UserService extends UserHelper implements IUserService {
	invitations: InvitationsModelType
	constructor(user: UserModelType, company: CompanyModelType) {
		super(user, company);
		this.invitations = Invitations;
	}

	/**
	 * User signup service 
	 * @param data 
	 * @returns userSubset
	 */
	async signUp(data: IUserSignUp): Promise<userSubset> {
		try {
			const { email, password, firstName, lastName, phoneNumber, profileImage, invitationId } = data;

			// If the user was invited the request body must contain the "invitationId"
			if (invitationId) {
				await this.signUpByInvitation(data);
			}

			let user = await this.user.findOne({ email: email });
			// check if user with the provided email already exist
			if (user) { throw this.userExist(`The email provided is already associated with another user's account`) };

			const name = (firstName && lastName) ? `${firstName} ${lastName}` : null;
			const userData: any = { name, email, password, phoneNumber };
			if (profileImage) {
				const { public_id, secure_url } = await this.uploadToCloudinary(profileImage, 'profile_image');
				userData.imagePublicId = public_id;
				userData.imageUrl = secure_url
			}
			user = await new this.user(userData).save();
			console.log(user)

			// send user email verification
			const notificationData: INotification = {
				db: user,
				reciever: email,
				subject: 'Verify your account',
				template: 'verify-account',
				templateData: {},
				redirectPath: 'verify'
			}
			await this.sendNoTification(notificationData);

			return this.getUserSubset(user);
		} catch (err: any) {
			throw this.handleError(err);
		}
	}

	/**
	 * Create a new user by invitation and add the user to the invitation sender's staffs list
	 * @param data 
	 * @returns userSubset
	 */
	async signUpByInvitation(data: IUserSignUp): Promise<userSubset> {
		const { APP_URL } = process.env;
		const { email, password, invitationId } = data;

		const invite = await this.invitations.findOne({ _id: invitationId });
		const { sendersId, companyId, inviteeRoll } = this.validateInvitation(invite);

		// get the user that sent the invitation
		const inviteSentBy = await this.user.findOne({ _id: sendersId });
		if (!inviteSentBy) this.userDoesNotExist('The invitation sender\'s ID is not valid');

		// get the company the user was invited to join
		const company = await this.company.findOne({ _id: companyId, ownersId: inviteSentBy._id });
		if (!company) { this.userDoesNotExist('The invitation sender does not own a company with the provided company ID'); }

		// if the invited user does not exist, create a new user account
		let user = await this.user.findOne({ email: email });
		if (!user) {
			user = await new this.user({ email: email, password: password, isVerified: true }).save();
			// Send a welcome unboard message to user on succesfull account setup
			const notificationData: INotification = {
				db: user,
				reciever: email,
				subject: 'Welcome to Rakatia',
				template: 'welcome',
				templateData: {},
				redirectPath: 'login'
			}
			await this.sendNoTification(notificationData);
		}

		// update the invitation schema status to accepted
		await this.invitations.updateOne({ _id: invitationId }, { invitationStatus: 'accepted' });

		// add the user to the company staffs list
		company.staffs.push({ staffId: user._id, role: inviteeRoll });
		await company.save();

		// Notify user that they've been added to a company 
		const notificationData: INotification = {
			db: user,
			reciever: email,
			subject: 'Invitation accepted',
			template: 'invite-accepted',
			templateData: { companyName: company.name, role: inviteeRoll },
			redirectPath: 'login'
		}
		await this.sendNoTification(notificationData);

		return this.getUserSubset(user);
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
				throw this.userDoesNotExist(`There's no user account associated with this email:- ${email}`);
			}

			// If non verified user try to signin throw error and resend new verification link
			if (user && !user.isVerified) {
				const notificationData: INotification = {
					db: user,
					reciever: email,
					subject: 'Verify your account',
					template: 'verify-account',
					templateData: {},
					redirectPath: 'verify'
				}
				await this.sendNoTification(notificationData);
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
				throw this.userDoesNotExist(`There's no user account associated with the provided userId`);
			}

			if (user.isVerified) {
				throw new Exception('Account already verified please proceed to login', 404);
			}

			const verificationCode: string = this.extractCode(user.code);
			const codeExpiryDate: string = this.extractCodeExpiry(user.code);
			if (this.isCodeExpired(codeExpiryDate)) {
				// Resend verification link
				const notificationData: INotification = {
					db: user,
					reciever: user.email,
					subject: 'Verify your account',
					template: 'verify-account',
					templateData: {},
					redirectPath: 'verify'
				}
				await this.sendNoTification(notificationData);
				throw new Exception('verification link has expired please check your email for a new link', 404);
			}

			// Compare the provided code with the user code
			if (code !== verificationCode) {
				throw new Exception('The verification code provided is not valid', 404);
			}
			// updated user status to verified
			await this.updateUser({ _id: userId }, { isVerified: true });

			// Send welcome email to user after successful account verification
			const notificationData: INotification = {
				db: user,
				reciever: user.email,
				subject: 'Welcome to Rakatia',
				template: 'welcome',
				templateData: {},
				redirectPath: 'login'
			}
			await this.sendNoTification(notificationData);

			return { userId: user._id };
		} catch (err) {
			throw this.handleError(err);
		}
	}

	/**
	 * reset  password service
	 * @param email
	 * @returns
	*/
	public async resetPassword(data: IUserEmail): Promise<void> {
		try {
			const { email } = data;
			const user = await this.user.findOne({ email: email });

			if (!user) {
				throw this.userDoesNotExist(`There's no user account associated with this email:- ${email}`);
			}

			// send reset code
			const notificationData: INotification = {
				db: user,
				reciever: email,
				subject: 'Reset password',
				template: 'reset-password',
				templateData: {},
				redirectPath: 'update-password'
			}
			await this.sendNoTification(notificationData);
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
				throw this.userDoesNotExist(`There's no user account associated with the provided userId`);
			}

			const verificationCode: string = this.extractCode(user.code);
			const codeExpiryDate: string = this.extractCodeExpiry(user.code);
			if (this.isCodeExpired(codeExpiryDate)) {
				// Resend passsword reset link
				const notificationData: INotification = {
					db: user,
					reciever: user.email,
					subject: 'Reset password',
					template: 'reset-password',
					templateData: {},
					redirectPath: 'update-password'
				}
				await this.sendNoTification(notificationData);
				throw new Exception('Link expired, a new password reset link has been sent to your email', 404);
			}

			// Compare the provided code with the user code
			if (code !== verificationCode) {
				throw new Exception('Invalid password reset code', 404);
			}
			// updated user status to verified
			newPassword = await this.hashPassword(newPassword);
			await this.updateUser({ _id: userId }, { password: newPassword });
			const notificationData: INotification = {
				db: user,
				reciever: user.email,
				subject: 'Password updated',
				template: 'password-updated',
				templateData: {},
				redirectPath: 'login'
			}
			await this.sendNoTification(notificationData);
		} catch (err) {
			throw this.handleError(err);
		}
	}
}
