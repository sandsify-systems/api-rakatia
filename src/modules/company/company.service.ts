import {
	IAcceptInvitation,
	ICompanyService,
	ICompanySignUp,
	ISendInvitation,
	comapnySubset,
} from './dto/company.dto';
import { UserModelType } from '../../core/database/models/user/user.model';
import { CompanyModelType } from '../../core/database/models/company/company.model';
import CompanyHelper from './helper';
import { Exception } from '../../core/utils';
import { INotification } from '../common/common.dto';
import { InvitationsModelType } from '../../core/database/models/invitations/invitations.model';


export default class CompanyService extends CompanyHelper implements ICompanyService {

	constructor(user: UserModelType, company: CompanyModelType, invitations: InvitationsModelType) {
		super(user, company, invitations);
	}

	/**
	 * Company signup service 
	 * @param data 
	 * @returns companySubset
	 */
	async createCompany(data: ICompanySignUp): Promise<comapnySubset> {
		try {
			let { ownersId, name, logo } = data;

			let user = await this.user.findOne({ _id: ownersId });
			if (!user) { throw new Exception('Invalid user ID', 402) };

			name = name.trim().toLowerCase();
			let company = await this.company.findOne({ name: name });

			// if a company with the given name already exist and is owned by the user
			if (company && company.ownersId === ownersId) {
				throw this.companyExist(`You currently have a company with the name: ${name}`);
			}

			// if a company with the given name already exist but not owned by the user
			if (company) {
				throw this.companyExist(`company with the name: ${name} exist`);
			}

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

			// Notify user on successful company setup
			const notificationData: INotification = {
				db: user,
				reciever: user.email,
				subject: 'Company setup successfull',
				template: 'company-created',
				templateData: { companyName: name },
				redirectPath: 'login'
			}
			await this.sendNoTification(notificationData);

			return this.getCompanySubset(company);
		} catch (err: any) {
			throw this.handleError(err);
		}
	}

	/**
	 * Company invitation service 
	 * @param data 
	 * @returns 
	 */
	async sendInvitation(data: ISendInvitation): Promise<void> {
		try {
			const { sendersId, inviteeEmail, companyId, role } = data;

			// validate senders ID
			const sender = await this.user.findOne({ _id: sendersId });
			if (!sender) { throw new Exception('Invalid sender ID', 402) };

			// validate company id 
			const comapny = await this.company.findOne({ _id: companyId });
			if (!comapny) { throw this.companyDoesNotExist(`There's not company associated with the provided companyId`) };

			// create invitation log
			const invitation = await new this.invitations({
				sendersId: sender._id,
				sendersEmail: sender.email,
				recieversEmail: inviteeEmail,
				companyId: companyId,
				inviteeRoll: role,
				invitationStatus: 'pending',
			}).save();

			/**
			 * if the invitee is a registered user send link to accept invite and login
			 *  else send link to signup and join company
			*/
			let reciever = await this.user.findOne({ email: inviteeEmail });
			let notificationData: INotification = {
				db: invitation,
				reciever: inviteeEmail,
				subject: `${sender.name} invites you to join ${comapny.name}`,
				template: 'send-invite',
				templateData: { sender: sender.name, companyName: comapny.name },
			}
			if (reciever) {
				// reciever will be redirected to accept-invitation page to accept invite or reject
				notificationData.redirectPath = 'accept-invitation'
			} else {
				// reciever will be redirected to signup page to signup and accept invite
				notificationData.redirectPath = 'signup'
			}

			await this.sendNoTification(notificationData);

		} catch (err: any) {
			throw this.handleError(err);
		}
	}

	/**
	 * Company accept invitation service 
	 * @param data 
	 * @returns 
	 */
	async acceptInvitation(data: IAcceptInvitation): Promise<void> {
		try {

		} catch (err: any) {
			throw this.handleError(err);
		}
	}
}
