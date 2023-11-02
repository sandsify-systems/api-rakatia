import {
	ICompanyService, ICompanySignUp, comapnySubset,
} from './dto/company.dto';
import { UserModelType } from '../../core/database/models/user/user.model';
import { CompanyModelType } from '../../core/database/models/company/company.model';
import CompanyHelper from './helper';

export default class CompanyService extends CompanyHelper implements ICompanyService {

	constructor(user: UserModelType, company: CompanyModelType) {
		super(user, company);
	}

	/**
	 * Company signup service 
	 * @param data 
	 * @returns companySubset
	 */
	async createCompany(data: ICompanySignUp): Promise<comapnySubset> {
		try {
			let { email, name, phoneNumber, logo } = data;

			let company = await this.company.findOne({ email: email });

			//check if company with the provided email already exist
			if (company) { throw this.companyExist(email) };

			let comapnyData: any = {
				...data,
			}

			if (logo) {
				const { public_id, secure_url } = await this.uploadToCloudinary(logo, 'company_logo');
				comapnyData.logoPublicId = public_id;
				comapnyData.logoUrl = secure_url
			}

			// Create company
			company = await new this.company(comapnyData).save();

			// Create a super-admin for the company
			name = `${name} superadmin`;
			const password = email.split('@')[0];
			const userData = {
				name,
				email,
				password,
				phoneNumber,
				roles: [{ role: 'super-admin', company: company }]
			};
			const admin = await new this.user(userData).save();

			// Add the admin user to the company's staffs list
			company.staffs.push(admin._id);
			company.save();

			// send company email verification
			this.sendVerificationLink(admin, 'Verify account');

			return this.getCompanySubset(company);
		} catch (err: any) {
			throw this.handleError(err);
		}
	}
}
