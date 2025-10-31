import Affiliate from '../models/Affiliate.js';

export const listAffiliates = async (req,res) => {
  const aff = await Affiliate.find().lean();
  res.json(aff);
};

export const createAffiliate = async (req,res) => {
  const { name, email } = req.body;
  const affiliate = new Affiliate({ name, email });
  await affiliate.save();
  res.json({ message: 'Criado', affiliate });
};
