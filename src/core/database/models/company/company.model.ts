import { Schema, model, Document, Types } from 'mongoose';
import shortid from 'shortid';

export interface ICompany extends Document {
    ownersId: Types.ObjectId
    name: string
    email?: string
    phoneNumber?: string
    address?: string
    code: string
    logoUrl?: string
    logoPublicId?: string
    industry?: string,
    website?: string,
    reference: string,
    staffs: [{ staffId: Types.ObjectId, role: string }]
}

export const CompanySchema: Schema = new Schema<ICompany>({
    ownersId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: false,
    },
    phoneNumber: {
        type: String,
        required: false,
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
        staffId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        role: String
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