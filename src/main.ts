import * as dotenv from 'dotenv';
dotenv.config();
import { app, PORT } from './app/app';
import {ConnectDatabase} from './core/database/dbConfig';
import { log } from './core/utils';

const bootstrap = async () => {
	await ConnectDatabase();
	app.listen(PORT, () => {
		log.info(`server running on port ${PORT}`);
	})
}

bootstrap().catch((err) => {
	log.error(err);
	process.exit(1);
})
