import { config } from 'dotenv';
config();
import { log } from '../utils/logger';
import mongoose from 'mongoose';

const { DATABASE_URL } = process.env;

export const ConnectDatabase = async () => {
	try {
		log.info('Establishing database connection...');
		await mongoose.connect(DATABASE_URL as string);
		log.info('App connected to database successfully...');
	} catch (err) {
		log.error('Error connecting to database', err);
	}
}

export const disconnect = async () => {
	try {
		await mongoose.disconnect();
	} catch (err) {
		log.error('Error connecting to database', err);
	}
};