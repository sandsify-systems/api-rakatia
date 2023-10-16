import {IUser} from "../../../core/database/models/user/user.model"

export interface IUserSignUp {
	firstName: string
	lastName: string
	email: string
	password: string
	phoneNumber: string
	roleType: string
}

export type userSubset = Pick<
IUser,
'firstName'|
'lastName'|
'email'|
'phoneNumber'|
'imageUrl'|
'imagePublicId'|
'role'|
'_id'
>