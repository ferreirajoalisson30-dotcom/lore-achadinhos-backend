import dotenv from 'dotenv';
import connectDB from '../config/mongo.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Affiliate from '../models/Affiliate.js';
import Setting from '../models/Setting.js';
import bcrypt from 'bcrypt';
dotenv.config();
await connectDB();

const adminExists = await User.findOne({ email: 'admin@lore.com' });
if(!adminExists){
  const hashed = await bcrypt.hash('admin123', 10);
  await User.create({ name:'Admin', email:'admin@lore.com', password: hashed, role:'admin' });
  console.log('Admin criado: admin@lore.com / admin123');
}

await Product.deleteMany({});
await Product.insertMany([
  { name: 'Vestido Lilás', price: 149.9, stock: 10, description: 'Vestido elegante lilás', images: ['/uploads/placeholder.png'] },
  { name: 'Sapatilha Rosa', price: 89.9, stock: 24, description: 'Sapatilha confortável', images: ['/uploads/placeholder.png'] }
]);

await Affiliate.deleteMany({});
await Affiliate.create({ name:'Afiliado Exemplo', email:'afil@lore.com' });

let s = await Setting.findOne();
if(!s) s = await Setting.create({});
s.banners = ['/uploads/banner1.jpg'];
await s.save();

console.log('Seed finalizado');
process.exit(0);
