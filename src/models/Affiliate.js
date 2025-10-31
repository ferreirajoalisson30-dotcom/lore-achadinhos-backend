import mongoose from 'mongoose';

const AffiliateSchema = new mongoose.Schema({
  name: String,
  email: String,
  settings: { type: Object, default: {} }
}, { timestamps: true });

export default mongoose.models.Affiliate || mongoose.model('Affiliate', AffiliateSchema);
