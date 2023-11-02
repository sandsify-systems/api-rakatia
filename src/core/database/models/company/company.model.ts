import { Schema, model, Document, Types } from 'mongoose';
import shortid from 'shortid';

export interface ICompany extends Document {
    name: string
    email: string
    phoneNumber: string
    address: string
    code: string
    logoUrl?: string
    logoPublicId?: string
    industry?: string,
    website?: string,
    reference: string,
    staffs: [Types.ObjectId]
}

export const CompanySchema: Schema = new Schema<ICompany>({
    email: {
        type: String,
        required: [true, 'please provide a valid email address'],
        index: { unique: true }
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    logoUrl: {
        type: String,
        required: false
    },
    logoPublicId: {
        type: String,
        required: false
    },
    reference: {
        type: String,
        required: true
    },
    staffs: [{
        type: Types.ObjectId,
        required: true
    }]
});

CompanySchema.pre<ICompany>('validate', async function (next: any) {
    try {
        // generare a reffrence code for the user before saving
        const prefix = 'RAKATIA-';
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        this.reference = prefix + shortid.generate() + randomNumber;

        next();
    } catch (error) {
        return next(error);
    }
});

const Company = model<ICompany>('Company', CompanySchema);

export type CompanyModelType = typeof Company;

export default Company;