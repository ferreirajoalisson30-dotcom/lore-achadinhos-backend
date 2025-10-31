import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { requireAuth } from '../middleware/auth.js';
const router = express.Router();
router.get('/', requireAuth(), getSettings);
router.put('/', requireAuth('admin'), updateSettings);

// additional simple banner upload endpoint (no DB save)
import { upload } from '../middleware/upload.js';
router.post('/banner', upload.single('banner'), (req,res) => {
  if(!req.file) return res.status(400).json({ message: 'No file' });
  res.json({ ok:true, path: `/uploads/${req.file.filename}` });
});

export default router;
