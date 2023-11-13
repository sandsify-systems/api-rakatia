import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import shortid from 'shortid';
import moment from 'moment';

export interface IUser extends Document {
    name?: string
    email: string
    password: string
    phoneNumber?: string
    code: string
    isVerified: boolean
    loginAttempts: number
    lockUntil: number
    imageUrl?: string
    imagePublicId?: string
    loginDevice: string
    reference: string
    roles: [{ role: string, company: Types.ObjectId }]
}

export const UserSchema: Schema = new Schema<IUser>({
    email: {
        type: String,
        required: [true, 'please provide a valid email address'],
        index: { unique: true }
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: String,
        required: false,
    },
    imageUrl: {
        type: String,
        required: false
    },
    imagePublicId: {
        type: String,
        required: false
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    code: {
        type: String,
        required: true
    },
    reference: {
        type: String,
        required: true
    },
    loginDevice: {
        type: String,
        required: false
    },
    loginAttempts: {
        type: Number,
        required: true,
        default: 0
    },
    lockUntil: {
        required: false,
        type: Number
    },
    roles: [{
        role: {
            type: String,
            enum: ['staff', 'admin', 'super-admin', 'manager'],
        },
        company: { type: Schema.Types.ObjectId, ref: 'Company' },
    }]
});

UserSchema.pre<IUser>('validate', async function (next: any) {
    try {
        // Hash user password before saving data
        const user = this;
        if (!user.isModified('password')) {
            return next();
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(user.password, salt);
        user.password = hashPassword;

        // generare a reffrence code for the user before saving
        const prefix = 'RAKATIA-';
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        this.reference = prefix + shortid.generate() + randomNumber;

        // Generate a code with expirery time and date for the user before saving
        const code: string = shortid.generate().replace('_', '');
        const expiry: string = moment(new Date(), "YYYY-MM-DD HH:mm:ss").add(1, 'month').format("YYYY-MM-DD HH:mm:ss");
        this.code = `${code}|${expiry}`;

        next();
    } catch (error) {
        return next(error);
    }
});

UserSchema.virtual('isLocked').get(function (): boolean {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

const User = model<IUser>('User', UserSchema);

export type UserModelType = typeof User;

export default User;