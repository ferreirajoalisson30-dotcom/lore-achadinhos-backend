import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  theme: {
    primary: { type: String, default: '#B388EB' },
    secondary: { type: String, default: '#F7D6E0' },
    fonts: { primary: { type: String, default: 'Poppins' }, secondary: { type: String, default: 'Inter' } }
  },
  banners: [String]
}, { timestamps: true });

export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
