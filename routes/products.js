// backend/routes/products.js
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import csvParse from "csv-parse/lib/sync";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, "../data/products.json");

// Multer setup for uploads
const upload = multer({ dest: path.join(__dirname, "../uploads/") });

// util: read/write products
function readProducts() {
  try {
    const raw = fs.readFileSync(dataFile, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}
function writeProducts(list) {
  fs.writeFileSync(dataFile, JSON.stringify(list, null, 2), "utf8");
}

// GET all products (public)
router.get("/", (req, res) => {
  const products = readProducts();
  res.json(products);
});

// GET single product
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const prod = readProducts().find(p => p.id === id);
  if (!prod) return res.status(404).json({ error: "Produto não encontrado" });
  res.json(prod);
});

// POST create product (admin)
router.post("/", (req, res) => {
  const list = readProducts();
  const nextId = list.reduce((a,b) => Math.max(a, b.id || 0), 0) + 1;
  const newProd = { id: nextId, ...req.body };
  list.push(newProd);
  writeProducts(list);
  res.status(201).json(newProd);
});

// PUT update product (admin)
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const list = readProducts();
  const idx = list.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: "Produto não encontrado" });
  list[idx] = { ...list[idx], ...req.body, id };
  writeProducts(list);
  res.json(list[idx]);
});

// DELETE product (admin)
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const list = readProducts();
  const filtered = list.filter(p => p.id !== id);
  if (filtered.length === list.length) return res.status(404).json({ error: "Produto não encontrado" });
  writeProducts(filtered);
  res.json({ ok: true });
});

/**
 * Import JSON file (multipart/form-data or raw JSON)
 * - Accepts an uploaded file `file` (application/json) OR body JSON array
 * - Merges or replaces depending on `?mode=merge|replace` (default merge)
 */
router.post("/import/json", upload.single("file"), (req, res) => {
  try {
    const mode = req.query.mode === "replace" ? "replace" : "merge";
    let incoming = [];
    if (req.file) {
      const raw = fs.readFileSync(req.file.path, "utf8");
      incoming = JSON.parse(raw);
      fs.unlinkSync(req.file.path);
    } else if (req.body && req.body.products) {
      incoming = Array.isArray(req.body.products) ? req.body.products : JSON.parse(req.body.products);
    } else {
      return res.status(400).json({ error: "Nenhum arquivo JSON ou payload fornecido" });
    }

    const current = readProducts();
    if (mode === "replace") {
      writeProducts(incoming);
      return res.json({ imported: incoming.length, mode });
    } else {
      // merge: avoid id collision; if incoming has no id, assign new ones
      const maxId = current.reduce((a, b) => Math.max(a, b.id || 0), 0);
      let nextId = maxId + 1;
      const normalized = incoming.map(item => {
        if (!item.id) item.id = nextId++;
        return item;
      });
      const merged = [...current, ...normalized];
      writeProducts(merged);
      return res.json({ imported: normalized.length, total: merged.length, mode });
    }
  } catch (err) {
    return res.status(500).json({ error: "Erro ao importar JSON", details: err.message });
  }
});

/**
 * Import CSV (multipart, field file)
 * Expected CSV columns: id (optional), name, price, image, description, category
 */
router.post("/import/csv", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Envie um arquivo CSV" });
    const raw = fs.readFileSync(req.file.path, "utf8");
    const records = csvParse(raw, { columns: true, skip_empty_lines: true });
    fs.unlinkSync(req.file.path);

    const current = readProducts();
    let maxId = current.reduce((a, b) => Math.max(a, b.id || 0), 0);
    const toAdd = records.map(r => {
      maxId++;
      return {
        id: r.id ? Number(r.id) : maxId,
        name: r.name || "",
        price: Number(r.price || 0),
        image: r.image || "",
        description: r.description || "",
        category: r.category || ""
      };
    });

    const merged = [...current, ...toAdd];
    writeProducts(merged);
    res.json({ imported: toAdd.length, total: merged.length });
  } catch (err) {
    res.status(500).json({ error: "Erro ao processar CSV", details: err.message });
  }
});

export default router;
