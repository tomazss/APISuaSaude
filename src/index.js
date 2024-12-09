import express from 'express';
import path from 'path';
import { main } from './bot.js';
import loginRouter from './login.js';
import authenticate from './auth.js';
import * as dotenv from 'dotenv';

dotenv.config();

const __dirname = path.resolve();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const quantidadeTokken = process.env.QUANTIDADE_TOKKEN
const temperatura = process.env.TEMPERATURA
// Rota raiz para mensagem de boas-vindas
app.get('/', (req, res) => {
  res.send('Bem-vindo à API Sua Saúde');
});

app.use('/login', loginRouter); // Use a rota de login antes do middleware de autenticação

// Rotas que requerem autenticação
app.use(authenticate);

const handleApiCall = async (req, res, prompt) => {
  try {
    const response = await main(prompt, parseInt(quantidadeTokken) , parseInt(temperatura));
    console.log("Resposta completa da API:", response);

    if (response && response.choices && response.choices.length > 0) {
       const responseMessage = { mensagem: response.choices[0].message.content.trim() };
      console.log("Recebido no servidor:", req.body); // Log dos dados recebidos
      res.json(responseMessage);
      console.log(responseMessage.mensagem)
    } else {
      console.log("Erro: resposta inválida da API", response);
      res.status(500).send("Erro no servidor: resposta inválida da API");
    }
  } catch (e) {
    console.log("Erro capturado:", e);
    res.status(500).send("Erro no servidor");
  }
};

app.post("/posologia", async (req, res) => {
  const { nome } = req.body;
  const prompt = `posologia resumida em 7 linhas do medicamento ${nome}`;
  await handleApiCall(req, res, prompt);
});

app.post("/indicacoes", async (req, res) => {
  const { nome } = req.body;
  const prompt = `indicações resumida em 6 linhas do ${nome}`;
  await handleApiCall(req, res, prompt);
});

app.post("/contraindicacoes", async (req, res) => {
  const { nome } = req.body;
  const prompt = `contra-indicações resumida em 5 linhas do ${nome}`;
  await handleApiCall(req, res, prompt);
});

app.post("/resultado", async (req, res) => {
  const { nome } = req.body;
  const prompt = `o que significa cada valor desse exame? e o que pode indicar um valor fora da referência ${nome}`;
  await handleApiCall(req, res, prompt);
});

app.post("/sintomas", async (req, res) => {
  const { nome } = req.body; // Receber os sintomas como um texto concatenado
  const prompt = `Verificando os seguintes sintomas: ${nome}, o que pode ser? o que devo fazer de imediato?`;
  await handleApiCall(req, res, prompt);
});

// Middleware de erro para JWT
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
  next(err);
});

app.listen(8080, () => {
  console.log('Servidor rodando na porta 8080');
});
