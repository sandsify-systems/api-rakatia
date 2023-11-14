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
import { INotification } from '../common/common.dto';
import { InvitationsModelType } from '../../core/database/models/invitations/invitations.model';
import UserHelper from '../users/helper';
import { IUserHelper } from '../users/dto/user.dto';
import { Exception } from '../../core/utils';
import { ObjectId } from 'mongodb';


export default class CompanyService extends CompanyHelper implements ICompanyService {
	userHelper: IUserHelper
	constructor(user: UserModelType, company: CompanyModelType, invitations: InvitationsModelType) {
		super(user, company, invitations);
		this.userHelper = new UserHelper(user, company);
	}

	/**
	 * Company signup service 
	 * @param data 
	 * @returns companySubset
	 */
	async createCompany(data: ICompanySignUp): Promise<comapnySubset> {
		try {
			let { ownersId, name, logo } = data;

			// Validate provided "ownersId" to ensure it is a valid mongodb schema ID format
			this.validateID(ownersId);

			let user = await this.user.findOne({ _id: ownersId });
			if (!user) {
				throw this.userHelper.userDoesNotExist('Invalid user ID, the given "ownersId" is not associated with any account');
			};

			name = name.trim().toLowerCase();
			let company = await this.company.findOne({ name: name });

			// if a company with the given name already exist and is owned by the user
			if (company && company.ownersId === ownersId) {
				throw this.companyExist(`You currently have a company with the name: ${name}`);
			}

			// if a company with the given name already exist but not owned by the user
			if (company) {
				throw this.companyExist(`company with the name: ${name} already exist`);
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

			// Validate provided "sendersId" & "companyId" to ensure they are valid mongodb schema ID format
			this.validateID(sendersId);
			this.validateID(companyId)

			// validate senders ID
			const sender = await this.user.findOne({ _id: sendersId });
			if (!sender) {
				throw this.userHelper.userDoesNotExist('The given "sendersId" is not associated with any account')
			};

			// Check if the sender is trying to invite self
			if (sender && sender.email === inviteeEmail) {
				throw this.userHelper.userExist('You can not send invitation to your self')
			};

			// prevent invite to unverified registered users
			const invitee = await this.user.findOne({ email: inviteeEmail });
			if (invitee && !invitee.isVerified) {
				throw this.userHelper.userExist('You can not send invitation to an unverified user, please tell them to complete the signup process and try aagain')
			};

			// validate company ID 
			const company = await this.company.findOne({ _id: companyId, ownersId: sender._id });
			if (!company) {
				throw this.companyDoesNotExist(`User does not own a company associated with the provided "companyId"`)
			};

			// check if the invitee is already a member of the company with the provided company ID
			if (invitee && company.staffs.some(staff => invitee._id.equals(staff.staffId))) {
				throw new Exception(`The user you are trying to invite is already a member of ${company.name}`, 422);
			}

			// create invitation log
			const invitation = await new this.invitations({
				sendersId: sender._id,
				sendersEmail: sender.email,
				recieversEmail: inviteeEmail,
				companyId: companyId,
				inviteeRole: role,
				invitationStatus: 'pending',
			}).save();

			/**
			 * If the invitee is a registered user send link 
			 * to accept invite or reject and redirect to login
			 * else send link to signup and join company
			*/
			let reciever = await this.user.findOne({ email: inviteeEmail });
			let notificationData: INotification = {
				db: invitation,
				reciever: inviteeEmail,
				subject: `${sender.name} invites you to join ${company.name}`,
				template: 'send-invite',
				templateData: { sender: sender.name, companyName: company.name },
			}
			if (reciever) {
				// reciever will be redirected to "accept-invitation" page to accept invite or reject
				notificationData.redirectPath = 'accept-invitation';
			} else {
				// reciever will be redirected to "signup-by-invitation" page
				notificationData.redirectPath = 'signup-by-invitation';
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
			const { invitationId } = data;

			// Validate provided "invitationId" to ensure it is a valid mongodb schema ID format
			this.validateID(invitationId);

			const invitation = await this.invitations.findOne({ _id: invitationId });
			const { sendersId, companyId, inviteeRole, recieversEmail } = this.validateInvitation(invitation);

			// get the user that sent the invitation
			const inviteSentBy = await this.user.findOne({ _id: sendersId });
			if (!inviteSentBy) {
				throw this.userHelper.userDoesNotExist('Invalid user ID, the given "sendersId" is not associated with any account')
			}
			// get the user the invitation was sent to
			const invitee = await this.user.findOne({ email: recieversEmail });
			if (!invitee) {
				throw this.userHelper.userDoesNotExist('The given "recieversEmail" is not associated with any account')
			}

			// get the company the user was invited to join
			const company = await this.company.findOne({ _id: companyId, ownersId: inviteSentBy._id });
			if (!company) {
				throw this.companyDoesNotExist('The invitation sender does not own a company with the given "companyId"');
			}

			await this.acceptInvite({ invitee, company, invitationId, reciever: invitee.email, role: inviteeRole });
		} catch (err: any) {
			throw this.handleError(err);
		}
	}
}
