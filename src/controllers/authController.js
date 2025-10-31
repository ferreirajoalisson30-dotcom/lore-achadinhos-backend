import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const secret = process.env.JWT_SECRET || 'dev_secret';
const tokenExpiry = process.env.TOKEN_EXPIRY || '7d';

export const register = async (req,res) => {
  const { name, email, password, role='client' } = req.body;
  if(!name || !email || !password) return res.status(400).json({ message: 'Dados incompletos' });
  const exists = await User.findOne({ email });
  if(exists) return res.status(400).json({ message: 'Email já cadastrado' });
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed, role });
  await user.save();
  res.json({ message: 'Usuário criado', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

export const login = async (req,res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.status(401).json({ message: 'Credenciais inválidas' });
  const ok = await bcrypt.compare(password, user.password);
  if(!ok) return res.status(401).json({ message: 'Credenciais inválidas' });
  const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: tokenExpiry });
  res.json({ token, user: { id: user._id, name:user.name, email:user.email, role:user.role } });
};
