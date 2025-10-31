import Setting from '../models/Setting.js';

export const getSettings = async (req,res) => {
  let s = await Setting.findOne();
  if(!s) {
    s = new Setting();
    await s.save();
  }
  res.json(s);
};

export const updateSettings = async (req,res) => {
  let s = await Setting.findOne();
  if(!s) s = new Setting();
  Object.assign(s, req.body);
  await s.save();
  res.json({ message: 'Atualizado', settings: s });
};
