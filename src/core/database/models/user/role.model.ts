import { Schema, model, Document } from 'mongoose';

export interface IRole extends Document {
  name: string;
  permissions:string[]
}

export const RoleSchema = new Schema<IRole>({
    name: {
        type: String,
        unique: true,
        required: true,
      },
      permissions: [String],
});

const Role = model<IRole>('Role', RoleSchema);

export type RoleModelType = typeof Role;

export default Role;
