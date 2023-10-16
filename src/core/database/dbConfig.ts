import { config } from 'dotenv';
config();
import { log } from '../utils/logger';
import mongoose from 'mongoose';
import Role from './models/user/role.model';


const { DATABASE_URL } = process.env;

export const ConnectDatabase = async () => {
	try {
		log.info('Establishing database connection...');
		await mongoose.connect(DATABASE_URL as string);
		log.info('App connected to database successfully...');

		// Pre-seed the role schema the first time the server start running
		const role = await Role.find();
		if (role.length === 0) {
			log.info('Started the process of seeding roles model');

			const roles = [
				{ name: 'staff', permissions: ['read', 'write'] },
				{ name: 'admin', permissions: ['read', 'write', 'delete', 'update'] },
				{ name: 'manager', permissions: ['all-permissions'] },
			];

			for (const role of roles) {
				await Role.create(role);
			}

			log.info('Seeding successful');
		}
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