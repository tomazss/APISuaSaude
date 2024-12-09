import express from 'express';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obter o caminho do arquivo atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente do arquivo .env
const envPath = `${__dirname}/../.env`;
dotenv.config({ path: envPath });

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

router.post('/', (req, res) => {
  const { username, password } = req.body;

  // Remover espaços extras
  const envUsername = process.env.ENV_USERNAME ? process.env.ENV_USERNAME.trim() : '';
  const envPassword = process.env.ENV_PASSWORD ? process.env.ENV_PASSWORD.trim() : '';

  // Log para verificar as variáveis de ambiente
  console.log('ENV USERNAME:', `"${envUsername}"`);
  console.log('ENV PASSWORD:', `"${envPassword}"`);
  console.log('Received USERNAME:', `"${username}"`);
  console.log('Received PASSWORD:', `"${password}"`);

  // Verifique as credenciais do usuário usando as variáveis do .env
  if (username === envUsername && password === envPassword) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  }

  res.status(401).json({ message: 'Credenciais inválidas' });
});

export default router;
