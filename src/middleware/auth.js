import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
dotenv.config();
const secret = process.env.JWT_SECRET || 'dev_secret';

export const requireAuth = (role) => async (req,res,next) => {
  try{
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).json({ message: 'Token required' });
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, secret);
    const user = await User.findById(payload.id).select('-password');
    if(!user) return res.status(401).json({ message: 'Usuário inválido' });
    if(role && user.role !== role) return res.status(403).json({ message: 'Acesso negado' });
    req.user = user;
    next();
  }catch(err){
    res.status(401).json({ message: 'Token inválido' });
  }
};
