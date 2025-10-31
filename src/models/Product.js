import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  description: { type: String, default: '' },
  images: { type: [String], default: [] },
  affiliateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliate', default: null }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
