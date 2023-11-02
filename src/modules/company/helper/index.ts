import { Exception } from '../../../core/utils';
import { UserModelType } from "../../../core/database/models/user/user.model";
import { CompanyModelType, ICompany } from '../../../core/database/models/company/company.model';
import _ from 'lodash';
import CommonHelper from '../../common';
import { ICommonHelper } from '../../common/common.dto';
import { comapnySubset } from '../dto/company.dto';

export default class CompanyHelper extends CommonHelper implements ICommonHelper {

	constructor(protected user: UserModelType, protected company: CompanyModelType) {
		super();
		this.user = user;
		this.company = company;
	}

	companyExist(userProperty: string): void {
		throw new Exception(`Company with property: "${userProperty}" already exist`, 422);
	}

	userDoesNotExist(userProperty: string): void {
		throw new Exception(
			`Company not found. There's no account associated with this cred: "${userProperty}".`,
			404
		);
	}

	getCompanySubset(company: ICompany): comapnySubset {
		const pick = _.pick(company, [
			'name',
			'email',
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
