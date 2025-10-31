import Product from '../models/Product.js';

export const listProducts = async (req,res) => {
  const products = await Product.find().sort({ createdAt: -1 }).lean();
  res.json(products);
};

export const getProduct = async (req,res) => {
  const p = await Product.findById(req.params.id);
  if(!p) return res.status(404).json({ message: 'Produto não encontrado' });
  res.json(p);
};

export const createProduct = async (req,res) => {
  const { name, price, stock, description, affiliateId } = req.body;
  const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
  const product = new Product({ name, price: Number(price||0), stock: Number(stock||0), description, images, affiliateId: affiliateId || null });
  await product.save();
  res.json({ message: 'Criado', product });
};

export const updateProduct = async (req,res) => {
  const changes = req.body;
  if(req.files) changes.images = (req.files.map(f=>`/uploads/${f.filename}`)).concat(changes.images || []);
  const product = await Product.findByIdAndUpdate(req.params.id, changes, { new: true });
  if(!product) return res.status(404).json({ message: 'Produto não encontrado' });
  res.json({ message: 'Atualizado', product });
};

export const deleteProduct = async (req,res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Removido' });
};
