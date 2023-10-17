import { IUserService, userSubset, type IUserSignUp } from './dto/service.dto';
import { Exception, log } from '../../core/utils';
import { FileArray } from 'express-fileupload';
import { RoleModelType } from '../../core/database/models/user/role.model';
import { UserModelType } from '../../core/database/models/user/user.model';
import UserHelper from './helper';

export default class UserService extends UserHelper implements IUserService {

	constructor(user: UserModelType, role: RoleModelType ) {
		super(user, role);
	}

	async signUp(data: IUserSignUp, upload: FileArray): Promise<userSubset> {
		try {
			// Todo: upload user image 
			// if (upload) {}

			const { email, roleType } = data;
			let user = await this.user.findOne({ email: email });

			//check if user with the provided email already exist
			this.doesUserExist(user, email);

			// default user role to staff if role type not present in request payload
			const userRole = roleType ? await this.role.findOne({ name: roleType }) :
				await this.role.findOne({ name: 'staff' });

			const $user = await new this.user({ ...data, role: userRole }).save();
			return this.getUserSubset($user);
		} catch (err: any) {
			log.error(err);
			const message = err.message ? err.message : 'Internal server error';
			const status = err.status ? err.status : 500;
			throw new Exception(message, status);
		}
	}
}
