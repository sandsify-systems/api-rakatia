import { log } from '../utils/logger';
import dataSource from './connConfig';

export const ConnectDatabase = async () => {
	await dataSource()
		.initialize()
		.then(() => {
			log.info('app connected to database');
		})
		.catch((err: any) => {
			log.error('Error connecting to database', err);
		})
}

export default ConnectDatabase;
