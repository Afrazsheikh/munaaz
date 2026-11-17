import mongoose, { Schema, Document, Model } from 'mongoose';
import { Address } from '@/types/order';

export interface IUserDocument extends Document {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  salt?: string;
  provider: 'credentials' | 'google';
  googleId?: string;
  avatar?: string;
  phone?: string;
  addresses: Address[];
  role: 'customer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const AddressSubSchema = new Schema<Address>(
  {
    id: { type: String, required: true },
    fullName: { type: String, required: true },
    street: { type: String, required: true },
    apartment: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, enum: ['IN', 'US'], default: 'IN' },
    phone: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  },
  { _id: false }
);

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: { type: String },
    salt: { type: String },
    provider: {
      type: String,
      enum: ['credentials', 'google'],
      default: 'credentials'
    },
    googleId: { type: String, index: true },
    avatar: { type: String, default: '' },
    phone: { type: String, default: '' },
    addresses: { type: [AddressSubSchema], default: [] },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: any) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        delete ret.salt;
        return ret;
      }
    }
  }
);

// Virtual id mapping
UserSchema.virtual('id').get(function () {
  return this._id ? this._id.toHexString() : '';
});

const UserModel: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);

export default UserModel;
