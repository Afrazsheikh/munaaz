import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdminUserDocument extends Document {
  email: string;
  passcode: string;
  updatedAt: string;
}

const AdminUserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true, default: 'admin@munaaz.com' },
  passcode: { type: String, required: true, default: 'munaaz2026' },
  updatedAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

const AdminUserModel: Model<IAdminUserDocument> = mongoose.models.AdminUser || mongoose.model<IAdminUserDocument>('AdminUser', AdminUserSchema);

export default AdminUserModel;
