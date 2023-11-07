import { Schema, model, Document, Types } from 'mongoose';
import shortid from 'shortid';
import moment from 'moment';

export interface Iinvitations extends Document {
    sendersId: Types.ObjectId
    sendersEmail: string
    recieversEmail: string
    companyId: Types.ObjectId
    inviteeRole: string
    invitationStatus: string
    code: string
}

export const InvitationsSchema: Schema = new Schema<Iinvitations>({
    sendersId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    sendersEmail: {
        type: String,
        required: true
    },
    recieversEmail: {
        type: String,
        required: true
    },
    companyId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    inviteeRole: {
        type: String,
        required: true
    },
    invitationStatus: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        dafault: 'pending'
    },
    code: {
        type: String,
        required: true
    }
});

InvitationsSchema.pre<Iinvitations>('validate', async function (next: any) {
    try {
        // Generate a token with expirery time and date for the invitation before saving
        let invite = this;
        const token: string = shortid.generate().replace('_', '');
        const expiry: string = moment(new Date(), "YYYY-MM-DD HH:mm:ss").add(1, 'month').format("YYYY-MM-DD HH:mm:ss");
        invite.code = `${token}|${expiry}`;

        next();
    } catch (error) {
        return next(error);
    }
});

export const Invitations = model<Iinvitations>('Invitations', InvitationsSchema);

export type InvitationsModelType = typeof Invitations;

export default Invitations;