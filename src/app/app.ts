import { config } from 'dotenv';
config();
import 'reflect-metadata';
import express, { type Application } from 'express';
import { handleErrors } from '../core/utils';
import router from './routes';

export const app: Application = express();

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(handleErrors);

export const { PORT } = process.env;