// backend/createUser.js
// 🧱 Criador de usuários administrativos — Lore Achadinhos
// Uso: node createUser.js --email=EMAIL --password=SENHA

import fs from "fs";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import path from "path";

// -----------------------------
// 🔹 Leitura dos argumentos
// -----------------------------
const args = process.argv.slice(2);
const emailArg = args.find(arg => arg.startsWith("--email="));
const passArg = args.find(arg => arg.startsWith("--password="));

if (!emailArg || !passArg) {
  console.error("❌ Uso correto: node createUser.js --email=EMAIL --password=SENHA");
  process.exit(1);
}

const email = emailArg.split("=")[1].trim().toLowerCase();
const password = passArg.split("=")[1].trim();

if (!email || !password) {
  console.error("⚠️ Email e senha são obrigatórios!");
  process.exit(1);
}

// -----------------------------
// 📁 Configura caminhos
// -----------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "data");
const usersFile = path.join(dataDir, "users.json");

// Cria pasta /data se não existir
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log("📂 Pasta 'data' criada.");
}

// -----------------------------
// 📄 Lê usuários existentes
// -----------------------------
let users = [];
if (fs.existsSync(usersFile)) {
  try {
    users = JSON.parse(fs.readFileSync(usersFile, "utf8"));
  } catch (err) {
    console.warn("⚠️ Erro ao ler users.json. Um novo arquivo será criado.");
    users = [];
  }
}

// -----------------------------
// 🚫 Evita duplicatas
// -----------------------------
if (users.find(u => u.email === email)) {
  console.error("⚠️ Usuário já existe:", email);
  process.exit(1);
}

// -----------------------------
// 🔐 Criptografa senha e adiciona
// -----------------------------
const hashedPassword = bcrypt.hashSync(password, 10);
const newUser = {
  id: Date.now(),
  email,
  password: hashedPassword,
  createdAt: new Date().toISOString()
};

users.push(newUser);
fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), "utf8");

console.log(`✅ Usuário criado com sucesso: ${email}`);
console.log(`📁 Arquivo salvo em: ${usersFile}`);
