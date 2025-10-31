// backend/routes/products.js
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsPath = path.join(__dirname, "../data/products.json");

// Rota GET para listar produtos
router.get("/", (req, res) => {
  try {
    const data = fs.readFileSync(productsPath, "utf8");
    const products = JSON.parse(data);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Erro ao ler lista de produtos." });
  }
});

export default router;
