import {
	IUserService,
	userSubset,
	IUserSignUp,
	IUserSignIn,
	IAccessToken
} from './dto/service.dto';
import { Exception } from '../../core/utils';
import { FileArray } from 'express-fileupload';
import { RoleModelType } from '../../core/database/models/user/role.model';
import { UserModelType } from '../../core/database/models/user/user.model';
import UserHelper from './helper';

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

			let userData:any = {
				...data,
				role:userRole
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
}
