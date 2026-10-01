import mongoose, { Schema, Document, Model } from 'mongoose';
import { Product } from '@/types/product';

export interface IProductDocument extends Omit<Product, 'id'>, Document {}

const ProductColorSchema = new Schema({
  name: { type: String, required: true },
  hex: { type: String, required: true },
  image: { type: String, required: true }
}, { _id: false });

const ProductVariantSchema = new Schema({
  id: { type: String, required: true },
  color: { type: String, required: true },
  size: { type: String, required: true },
  sku: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 }
}, { _id: false });

const ProductSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  brand: { type: String, default: 'MUNAAZ ATELIER' },
  category: { type: String, required: true, enum: ['men', 'women', 'jewelry', 'accessories'] },
  collections: [{ type: String }],
  shortDescription: { type: String, default: '' },
  description: { type: String, default: '' },
  fabricCare: [{ type: String }],
  features: [{ type: String }],
  priceINR: { type: Number, required: true },
  compareAtPriceINR: { type: Number },
  priceUSD: { type: Number, required: true },
  compareAtPriceUSD: { type: Number },
  images: [{ type: String, required: true }],
  colors: [ProductColorSchema],
  sizes: [{ type: String }],
  variants: [ProductVariantSchema],
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isSale: { type: Boolean, default: false },
  discountPercentage: { type: Number },
  rating: { type: Number, default: 5.0 },
  reviewCount: { type: Number, default: 1 },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

const ProductModel: Model<IProductDocument> = mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);

export default ProductModel;
