import { config } from 'dotenv';
config();
import 'reflect-metadata';
import express, { type Application } from 'express';
import { handleErrors } from '../core/utils';
import router from './routes';
import fileupload from 'express-fileupload';
import swaggerDefinition from '../core/swagger/swaggerDefinition';
import swaggerUI from 'swagger-ui-express';
import { log } from '../core/utils';
import { Exception } from '../core/utils';
import cors from 'cors';

export const app: Application = express();
const corsOptions: cors.CorsOptions = {
  origin: []
};

app.use(cors(corsOptions));
app.use(
  fileupload({
    createParentPath: true,
    tempFileDir: '/tmp/'
  }),
);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use('/rakatia-api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDefinition));
app.use(handleErrors);

// Return a global message for any unregistered routes
// app.all('*', (req:Request, res:Response, next:NextFunction)=> {
//   log.info(`Resource not found`);
//   return res.send({
//     status: 'resource not found',
//     code: 400
//   });
// });

// Handle any internal unhandle exception
process.on('unhandledRejection', (reason, promise) => {
  log.error(`Unhandled Rejection: ${reason} ex: ${promise}`);
  throw new Exception('Internal server error', 500);
});

export const { PORT } = process.env;