// backend/server.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import productsRoute from "./routes/products.js";
import adminUsersRoute from "./routes/adminUsers.js";
import jwt from "jsonwebtoken";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "lore-secret-dev";

app.use(cors());
app.use(helmet());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/api/products", productsRoute);
app.use("/api/admin/users", adminUsersRoute);

// Simple auth route for login (returns token)
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const usersFile = path.join(__dirname, "data/users.json");
  try {
    const users = JSON.parse(fs.readFileSync(usersFile, "utf8"));
    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).json({ error: "Credenciais inválidas" });
    // compare
    const bcrypt = await import("bcrypt");
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Credenciais inválidas" });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, categories: user.categories || [] }, JWT_SECRET, { expiresIn: "12h" });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, categories: user.categories || [] } });
  } catch (err) {
    res.status(500).json({ error: "Erro no login", details: err.message });
  }
});

app.get("/", (req, res) => res.json({ status: "API Lore Achadinhos", ok: true }));

app.listen(PORT, () => console.log(`API rodando em ${PORT}`));
