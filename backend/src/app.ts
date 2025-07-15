import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { validateProduct, orderRouteValidator } from './middlewares/validations';
import { errors } from 'celebrate';
import errorHandler from './middlewares/error-handler';

dotenv.config();
const { PORT = 3000, DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek' } = process.env;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(DB_ADDRESS);

app.use('/product', validateProduct);
app.use('/order', orderRouteValidator);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(PORT);
});