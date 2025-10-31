// backend/server.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import productsRoute from "./routes/products.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações básicas
app.use(cors());
app.use(helmet());
app.use(express.json());

// Corrigir caminhos de módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rota pública para produtos
app.use("/api/products", productsRoute);

// Rota inicial simples (teste)
app.get("/", (req, res) => {
  res.json({
    status: "✅ API Lore Achadinhos Online",
    message: "Servidor rodando com sucesso!",
  });
});

// Servir frontend opcional (se necessário futuramente)
app.use(express.static(path.join(__dirname, "public")));

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
