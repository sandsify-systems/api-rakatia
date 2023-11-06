import { Exception } from '../../../core/utils';
import { UserModelType } from "../../../core/database/models/user/user.model";
import { CompanyModelType, ICompany } from '../../../core/database/models/company/company.model';
import _ from 'lodash';
import CommonHelper from '../../common';
import { ICommonHelper } from '../../common/common.dto';
import { comapnySubset } from '../dto/company.dto';
import { InvitationsModelType } from '../../../core/database/models/invitations/invitations.model';

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
