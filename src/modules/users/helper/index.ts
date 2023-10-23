import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Exception, log } from '../../../core/utils';
import moment from 'moment';
import * as shortid from 'shortid';
import { IUser } from '../../../core/database/models/user/user.model';
import {
	userSubset,
	IAccessToken,
	IUserHelper,
	Dictionary
} from '../dto/service.dto';
import _ from 'lodash';
import { UserModelType } from "../../../core/database/models/user/user.model";
import { RoleModelType } from "../../../core/database/models/user/role.model";
import { sendEmail } from '../../../core/utils/mailer';
import { FileArray, UploadedFile } from 'express-fileupload';
import { UploadApiResponse } from 'cloudinary';
import CloudinaryClient from '../../../core/cloudinary/cloudinary';
import { ICloudinary } from '../../../core/cloudinary/cloudinary.types';
import path from 'path';

export default class UserHelper implements IUserHelper {
	cloudinaryClient: ICloudinary

	constructor(
		protected user: UserModelType,
		protected role: RoleModelType,
	) {
		this.user = user;
		this.role = role;
		this.cloudinaryClient = new CloudinaryClient()
	}

	async hashPassword(password: string): Promise<string> {
		const hash = await bcryptjs.hash(password, 10);
		return hash;
	}

	async comparePassword(password: string, hashedPassword: string): Promise<void> {
		const verifiedPassword: boolean = await bcryptjs.compare(password, hashedPassword);

		if (!verifiedPassword) {
			throw new Exception('Invalid credentials. Please check your email and password and try again.', 404);
		}
	}

	generateAccessToken(data: userSubset): IAccessToken {
		const token = jwt.sign(
			{ ...data, expireAt: '24hr' },
			process.env.JWT_SECRET as string
		);
		return { token: token };
	}

	createCode(): string {
		const code: string = shortid.generate().replace('_', '');
		const expiry = moment(new Date(), "YYYY-MM-DD HH:mm:ss").add(1, 'month').format("YYYY-MM-DD HH:mm:ss");
		return `${code}|${expiry}`;
	};

	extractCode(code: string): string { return code.split('|')[0]; };

	extractCodeExpiry(code: string): string { return code.split('|')[1] };

	isCodeExpired(codeExpiryDate: string): boolean {
		const currentTime = moment(new Date(), "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
		return moment(codeExpiryDate).isBefore(currentTime);
	};

	doesUserExist(user: IUser | null, email: string): void {
		if (user) {
			throw new Exception(`User with email: ${email} already exist`, 422);
		}
	}

	createShortId(): string {
		let id = shortid.generate();
		return id.replace('-', '');
	}

	async createVerificationUrl(userId: string, code: string, path: string): Promise<string> {
		/**
		 * check if the current code has expired before attaching to link
		 * If code has expired create a new one and update user data
		*/
		let verificationCode;
		let codeExpiryDate = this.extractCodeExpiry(code)
		if (this.isCodeExpired(codeExpiryDate)) {
			verificationCode = this.createCode();
			await this.updateUser({ _id: userId }, { code: verificationCode })
			// await this.user.updateOne({ _id: userId }, { code: verificationCode });
		} else {
			verificationCode = code;
		}
		const app_url = process.env.APP_URL
		return `${app_url}/${path}/${userId}_${this.createShortId()}_${this.extractCode(verificationCode)}_${this.createShortId()}`;
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

	async sendVerificationLink(user: IUser): Promise<void> {
		// send user email verification
		const { _id, code, email } = user;
		let link = await this.createVerificationUrl(_id, code, 'verify');
		let testTemaplate = `<div><a href=${link}>verify account</a></div>`;
		await sendEmail(email, testTemaplate);
	}

	handleError(err: any): void {
		log.error(err);
		const message = err.message ? err.message : 'Internal server error';
		const status = err.status ? err.status : 500;
		throw new Exception(message, status);
	}

	// Upload image to cloudinary
	async uploadProfileImage(upload: FileArray): Promise<UploadApiResponse> {
		const profileImage = <UploadedFile>upload.profileImage;
		const ext: string = path.extname(profileImage.name);
		// validate uploaded file
		this.cloudinaryClient.validateImage(ext, profileImage.size);

		const uploadPth: string = path.join(__dirname, `../../../uploads/${profileImage.name}`);

		// move uploaded file from temp memory storage to "files dir"
		await profileImage.mv(uploadPth);
		const imageUploadRes: UploadApiResponse = await this.cloudinaryClient.upload(uploadPth);

		// delete the uploaded image from the codebase after successful upload to cloudinary
		this.cloudinaryClient.deleteTempUploads(uploadPth);
		return imageUploadRes;
	}

	async updateUser(params: Dictionary, data: Dictionary): Promise<void> {
		await this.user.updateOne(params, data);
	}
}
