import express from 'express';
import { listAffiliates, createAffiliate } from '../controllers/affiliateController.js';
import { requireAuth } from '../middleware/auth.js';
const router = express.Router();
router.get('/', requireAuth('admin'), listAffiliates);
router.post('/', requireAuth('admin'), createAffiliate);
export default router;
