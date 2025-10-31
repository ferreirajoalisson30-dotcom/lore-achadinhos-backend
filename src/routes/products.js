// backend/src/routes/products.js
import express from 'express';
import fs from 'fs';
import path from 'path';
const router = express.Router();

router.get('/', (req, res) => {
  const file = path.join(process.cwd(), 'backend', 'data', 'produtos.json');
  try {
    if (fs.existsSync(file)) {
      const raw = fs.readFileSync(file, 'utf8');
      const data = JSON.parse(raw);
      return res.json(Array.isArray(data) ? data : []);
    } else {
      // fallback sample
      return res.json([]);
    }
  } catch (err) {
    console.error('Error reading produtos.json', err);
    return res.status(500).json({ error: 'Erro interno ao ler produtos' });
  }
});

export default router;
