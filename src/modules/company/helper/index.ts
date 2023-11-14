import { Exception } from '../../../core/utils';
import { UserModelType } from "../../../core/database/models/user/user.model";
import { CompanyModelType, ICompany } from '../../../core/database/models/company/company.model';
import _ from 'lodash';
import CommonHelper from '../../common';
import { Dictionary, ICommonHelper, INotification } from '../../common/common.dto';
import { comapnySubset } from '../dto/company.dto';
import { Iinvitations, InvitationsModelType } from '../../../core/database/models/invitations/invitations.model';

export default class CompanyHelper extends CommonHelper implements ICommonHelper {

	constructor(
		protected user: UserModelType,
		protected company: CompanyModelType,
		protected invitations: InvitationsModelType
	) {
		super();
		this.user = user;
		this.company = company;
		this.invitations = invitations
	}

	companyExist(message: string): void {
		throw new Exception(message, 422);
	}

	companyDoesNotExist(message: string): void {
		throw new Exception(message, 404);
	}

	validateInvitation(invite: Iinvitations | null): Iinvitations {

		if (!invite) {
			throw new Exception('Invitation not or has expired', 402);
		}
		if (invite.invitationStatus === 'accepted') {
			throw new Exception('Invitation already accepted please proceed to login', 402)
		}
		if (invite.invitationStatus === 'rejected') {
			throw new Exception('Invitation already rejected please ask the sender to send a new invitation or proceed to signup page', 402)
		}

		// Note: we could also check for expired invitation by checking the code expiry
		// if (this.isCodeExpired(invite.invitationCode)) {
		// 	throw new Exception('Invalid invitation code', 402);
		// }

		return invite;
	}

	async acceptInvite(data: Dictionary): Promise<void> {
		const { invitee, company, invitationId, reciever, role } = data;
		try {
			// update the invitation schema status to accepted
			await this.invitations.updateOne({ _id: invitationId }, { invitationStatus: 'accepted' });

			// add the user to the company staffs list
			company.staffs.push({ staffId: invitee._id, role: role });
			await company.save();

			// update the invitee role
			invitee.roles.push({ role: role, company: company });
			invitee.save();

			// Notify user that they've been added to a company 
			const notificationData: INotification = {
				db: invitee,
				reciever: reciever,
				subject: 'Invitation accepted',
				template: 'invite-accepted',
				templateData: { companyName: company.name, role: role },
				redirectPath: 'login'
			};
			return await this.sendNoTification(notificationData);
		} catch (err: any) {
			throw this.handleError(err);
		}
	}

	getCompanySubset(company: ICompany): comapnySubset {
		const pick = _.pick(company, [
			'name',
			'email',
			'ownersId',
			'phoneNumber',
			'logoUrl',
			'logoPublicId',
			'address',
			'website',
			'industry',
			'_id'
		]);
		return pick;
	}
}
