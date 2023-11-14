import {
	IUserService,
	TypeUserSubset,
	IUserSignUp,
	IUserSignIn,
	IAccessToken,
	IVerifyAccount,
	IUserEmail,
	IUpdatePassword,
	IDecodedToken,
	IUpdateUser,
	IGetUser,
} from './dto/user.dto';
import { Exception } from '../../core/utils';
import { IUser, UserModelType } from '../../core/database/models/user/user.model';
import UserHelper from './helper';
import { CompanyModelType } from '../../core/database/models/company/company.model';
import Invitations from '../../core/database/models/invitations/invitations.model';
import { InvitationsModelType } from '../../core/database/models/invitations/invitations.model';
import { INotification } from '../common/common.dto';
import { Dictionary } from '../common/common.dto';
import CompanyHelper from '../company/helper';
import { ICompanyHelper } from '../company/dto/company.dto';

export default class UserService extends UserHelper implements IUserService {
	invitations: InvitationsModelType
	companyHelper: ICompanyHelper;

	constructor(user: UserModelType, company: CompanyModelType) {
		super(user, company);
		this.invitations = Invitations;
		this.companyHelper = new CompanyHelper(user, company, Invitations);
	}

	/**
	 * User signup service 
	 * @param data 
	 * @returns TypeUserSubset
	 */
	async signUp(data: IUserSignUp): Promise<TypeUserSubset> {
		try {
			const { email, password, firstName, lastName, phoneNumber, profileImage, invitationId } = data;

			// If the user was invited the request body must contain the "invitationId"
			if (invitationId) {
				return await this.signUpByInvitation(data);
			}

			let user: IUser = await this.user.findOne({ email: email });
			// check if user with the provided email already exist
			if (user) {
				throw this.userExist(`The email provided is already associated with another user's account`)
			};

			// check if user with the provided phoneNumber already exist
			if (phoneNumber) {
				user = await this.user.findOne({ phoneNumber: phoneNumber });
				if (user) {
					throw this.userExist(`The phoneNumber provided is already associated with another user's account`);
				}
			};

			const name = (firstName && lastName) ? `${firstName} ${lastName}` : null;
			const userData: Dictionary = { name, email, password, phoneNumber };
			if (profileImage) {
				const { public_id, secure_url } = await this.uploadToCloudinary(profileImage, 'profile_image');
				userData.imagePublicId = public_id;
				userData.imageUrl = secure_url
			}

			user = await this.createUser(userData);
			return this.getUserSubset(user);
		} catch (err: any) {
			throw this.handleError(err);
		}
	}

	/**
	 * Create a verified user if invitation ID is given
	 * @param userData 
	 * @param invitationId 
	 * @returns TypeUserSubset
	 */
	async createUser(userData: Dictionary, invitationId = null): Promise<IUser> {
		try {
			let user: IUser;
			let notificationData: INotification;

			// If invitation ID is given create a
			if (invitationId) {
				user = await new this.user(userData).save();
				// Send a welcome unboard message to user on succesfull account setup
				notificationData = {
					db: user,
					reciever: user.email,
					subject: 'Welcome to Rakatia',
					template: 'welcome',
					templateData: {},
					redirectPath: 'login'
				}
			} else {
				user = await new this.user(userData).save();
				// send user email verification
				notificationData = {
					db: user,
					reciever: user.email,
					subject: 'Verify your account',
					template: 'verify-account',
					templateData: {},
					redirectPath: 'verify'
				}
			}
			await this.sendNoTification(notificationData);

			return user;;
		} catch (err) {
			throw this.handleError(err);
		}
	}

	/**
	 * Create a new user by invitation and add the user to the invitation sender's staffs list
	 * @param data 
	 * @returns TypeUserSubset
	 */
	async signUpByInvitation(data: IUserSignUp): Promise<TypeUserSubset> {
		try {
			const { email, password, invitationId } = data;
			const invitation = await this.invitations.findOne({ _id: invitationId, recieversEmail: email });
			const { sendersId, companyId, inviteeRole } = this.companyHelper.validateInvitation(invitation);

			// get the user that sent the invitation
			const inviteSentBy = await this.user.findOne({ _id: sendersId });
			if (!inviteSentBy) {
				this.userDoesNotExist('The invitation sender\'s ID is not valid');
			}
			// get the company the user was invited to join
			const company = await this.company.findOne({ _id: companyId, ownersId: inviteSentBy._id });
			if (!company) {
				this.userDoesNotExist('The invitation sender does not own a company with the provided company ID');
			}

			// if the invited user does not exist, create a new user account
			let invitee: IUser = await this.user.findOne({ email: email });
			if (!invitee) {
				invitee = await this.createUser({ email: email, password: password, isVerified: true }, invitationId);
			}
			await this.companyHelper.acceptInvite({ invitee, company, invitationId, reciever: email, role: inviteeRole });

			return this.getUserSubset(invitee);
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
				throw this.userExist('The account associated with this email is not verified. Please check your email for a new verification link');
			}

			await this.comparePassword(password, user.password);
			const accessToken = this.generateAccessToken({ id: user._id });
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

			// Validate provided "userId" to ensure it is a valid mongodb schema ID format
			this.validateID(userId);

			if (!user) {
				throw this.userDoesNotExist(`There's no user account associated with the provided userId`);
			}

			if (user.isVerified) {
				throw this.userExist('Account already verified please proceed to login');
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
			await this.userUpdate({ _id: userId }, { isVerified: true });

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

			// Validate provided "userId" to ensure it is a valid mongodb schema ID format
			this.validateID(userId);

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
			await this.userUpdate({ _id: userId }, { password: newPassword });
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

	/**
	 * get user service
	 * @param params
	 * @returns User
	 */
	public async getUser(params: IDecodedToken): Promise<IGetUser> {
		try {
			const { id } = params;
			const user = await this.user.findOne({ _id: id });
			const companies = await this.company.find({ ownersId: id });
			if (!user) {
				throw this.userDoesNotExist(`There's no user account associated with the provided userId`);
			}
			return { user: this.getUserSubset(user), companiesOwnedByUser: companies };
		} catch (err) {
			throw this.handleError(err);
		}
	}

	/**
	 * update user service
	 * @param data
	 * @returns 
	 */
	public async updateUser(data: IUpdateUser): Promise<TypeUserSubset> {
		try {
			let { id, firstName, lastName, phoneNumber } = data;

			// Validate provided "userId" to ensure it is a valid mongodb schema ID format
			this.validateID(id);

			let user = await this.user.findOne({ _id: id });

			if (!user) {
				throw this.userDoesNotExist(`There's no user account associated with the provided userId`);
			}

			const name = (firstName && lastName) ? `${firstName} ${lastName}` : null;
			const updated = await this.userUpdate({ _id: id }, { name, phoneNumber });
			const notificationData: INotification = {
				db: user,
				reciever: user.email,
				subject: 'Data updated',
				template: 'user-updated',
				templateData: {},
				redirectPath: 'login'
			}
			await this.sendNoTification(notificationData);
			return updated;
		} catch (err) {
			throw this.handleError(err);
		}
	}
}
