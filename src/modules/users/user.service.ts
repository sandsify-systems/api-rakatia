import { userSubset, type IUserSignUp } from './dto/auth.dto';
import { Exception, log } from '../../core/utils';
import { FileArray } from 'express-fileupload';
import Role from '../../core/database/models/user/role.model';
import User from '../../core/database/models/user/user.model';
import UserHelper from './helper';

export default class UserService {
	userHelper: typeof UserHelper
	user: typeof User
	role: typeof Role

	constructor() {
		this.userHelper = UserHelper;
		this.user = User;
		this.role = Role
	}

	async signUp(data: IUserSignUp, upload: FileArray): Promise<userSubset> {
		try {
			// Todo: upload user image 
			// if (upload) {}

			const { email, roleType } = data;
			let user = await this.user.findOne({ email: email });

			//check if user with the provided email already exist
			this.userHelper.doesUserExist(user, email);

			// default user role to staff if role type not present in request payload
			const userRole = roleType ? await Role.findOne({ name: roleType }) :
				await this.role.findOne({ name: 'staff' });

			const $user = await new this.user({ ...data, role: userRole }).save();
			return this.userHelper.getUserSubset($user);
		} catch (err: any) {
			log.error(err);
			const message = err.message ? err.message : 'Internal server error';
			const status = err.status ? err.status : 500;
			throw new Exception(message, status);
		}
	}
}
