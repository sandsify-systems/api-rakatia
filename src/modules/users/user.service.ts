import { type IUserSignUp } from './dto/auth.dto';
import { Exception, log } from '../../core/utils';
import { FileArray } from 'express-fileupload';
import Role from '../../core/database/models/user/role.model';
import User from '../../core/database/models/user/user.model';
import UserHelper from './helper';
import { Schema } from 'mongoose';

export default class UserService {
	userHelper: typeof UserHelper
	constructor() {
		this.userHelper = UserHelper;
	}

	async signUp(data: IUserSignUp, upload: FileArray): Promise<{ userId: Schema.Types.ObjectId }> {
		try {
			// Todo: upload user image 
			// if (upload) {}

			const { email, roleType } = data;
			let user = await User.findOne({ email: email });
			
			//check if user with the provided email already exist
			this.userHelper.doesUserExist(user, email);

			// default user role to staff if role type not present in request payload
			const userRole = roleType ? await Role.findOne({ name: roleType }) :
				await Role.findOne({ name: 'staff' });

			user = await new User({ ...data, role: userRole }).save();
			// return only the userId
			return { userId: user._id }
		} catch (err: any) {
			log.error(err);
			const message = err.message ? err.message : 'Internal server error';
			const status = err.status ? err.status : 500;
			throw new Exception(message, status);
		}
	}
}
