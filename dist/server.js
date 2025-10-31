// Dist build - servidor pronto para produção (Node 18+)
// Observação: instale dependências listadas no package.json antes de rodar.
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// rate limiting básico
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// rotas estáticas (caso tenha assets públicos do backend)
app.use('/public', express.static(path.join(__dirname, '../public')));

app.get('/api/health',(req,res)=>res.json({status:'ok',time:new Date().toISOString()}));

app.post('/api/login',(req,res)=>{
  const {email,password} = req.body||{};
  // demo: usuários simulados
  if(email==='admin@lore.com' && password==='password') {
    return res.json({token:'SIMULATED_TOKEN_123',user:{email:'admin@lore.com',role:'admin'}});
  }
  if(email==='cliente@lore.com' && password==='password') {
    return res.json({token:'SIMULATED_TOKEN_456',user:{email:'cliente@lore.com',role:'client'}});
  }
  return res.status(401).json({message:'Credenciais inválidas'});
});

// Error handler
app.use((err,req,res,next)=>{
  console.error(err);
  res.status(500).json({message:'Erro interno'});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log('Server running on',PORT));
