// backend/src/routes/admins.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
const router = express.Router();

const USERS_FILE = path.join(process.cwd(), 'backend', 'data', 'users.json');

function readUsers(){
  if (fs.existsSync(USERS_FILE)) {
    try { return JSON.parse(fs.readFileSync(USERS_FILE,'utf8')); } catch(e){ return []; }
  }
  return [];
}
function saveUsers(u){ fs.writeFileSync(USERS_FILE, JSON.stringify(u,null,2)); }

router.post('/', async (req, res) => {
  const { email, password, name, categories = [] } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email e password são necessários' });

  const users = readUsers();
  if (users.find(u => u.email === email)) return res.status(409).json({ error: 'Usuário já existe' });

  const hash = await bcrypt.hash(password, 10);
  const newUser = { id: `u${Date.now()}`, email, passwordHash: hash, name: name || email, role: 'admin', categories };
  users.push(newUser);
  saveUsers(users);
  res.status(201).json({ ok: true, id: newUser.id });
});

router.get('/', (req, res) => {
  const users = readUsers().map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role, categories: u.categories || [] }));
  res.json(users);
});

export default router;
