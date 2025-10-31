import User from '../models/User.js';
import bcrypt from 'bcrypt';

export const listUsers = async (req,res) => {
  const users = await User.find().select('-password').lean();
  res.json(users);
};

export const createUser = async (req,res) => {
  const { name, email, password, role='client' } = req.body;
  const exists = await User.findOne({ email });
  if(exists) return res.status(400).json({ message: 'Email existe' });
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed, role });
  await user.save();
  res.json({ message: 'Usuário criado', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

export const updateUser = async (req,res) => {
  const changes = req.body;
  if(changes.password) changes.password = await bcrypt.hash(changes.password, 10);
  const user = await User.findByIdAndUpdate(req.params.id, changes, { new: true }).select('-password');
  if(!user) return res.status(404).json({ message: 'Usuário não encontrado' });
  res.json({ message: 'Atualizado', user });
};

export const removeUser = async (req,res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Removido' });
};
