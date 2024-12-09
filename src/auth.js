import { expressjwt } from 'express-jwt';
import * as dotenv from 'dotenv'

dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY;

const authenticate = expressjwt({ secret: SECRET_KEY, algorithms: ['HS256'] }).unless({
  path: ['/login'], // Rota de login não protegida
});

export default authenticate;
