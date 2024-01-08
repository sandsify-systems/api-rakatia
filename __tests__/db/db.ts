import { config } from 'dotenv';
config();
import { log } from '../../src/core/utils';
import mongoose from 'mongoose';
import { Dictionary, IUserSignUp } from '../../src/modules/users/dto/user.dto';
import User from '../../src/core/database/models/user/user.model';
import moment from 'moment';

const { TEST_DATABASE_URL } = process.env;

export const ConnectTestDb = async () => {
    try {
        log.info('Establishing database connection...');
        await mongoose.connect(TEST_DATABASE_URL as string);
        log.info('App connected to test db successfully...');
    } catch (err) {
        log.error('Error connecting to test db', err);
    }
}

export const disconnectTestDb = async () => {
    try {
        await mongoose.disconnect();
        log.info('App disconnected from test db successfully...');
    } catch (err) {
        log.error('Error occured while disconnecting test db', err);
    }
};

export const getUser = async (params: Dictionary) => {
    try {
        let user = await User.findOne(params);
        log.info('Test user fetched successfully...');
        return user;
    } catch (E) {
        log.error('error occured while fetching test user');
    }
}

export const createUser = async (data: IUserSignUp) => {
    try {
        let user = await new User(data).save();
        log.info('Test user created successfully...');
        return user;
    } catch (E) {
        log.error('error occured while creating test user');
    }
}

export const updateUser = async (params: Dictionary, data: Dictionary) => {
    try {
        await User.updateOne(params, data);
        log.info('Test user updated successfully...');
        return await getUser(params);
    } catch (E) {
        log.error('error occured while updating test user');
    }
}

export const removeUser = async (email: string) => {
    try {
        await new User().deleteOne({ email: email });
        log.info('Test user deleted successfully...');
    } catch (E) {
        log.error('error occured while deleting test user');
    }
}

export const clearDb = async () => {
    try {
        await User.deleteMany({});
        log.info('DB cleared successfully...');
    } catch (E) {
        log.error('error occured while clearing DB');
    }
}

export const createExpiredCode = (code: string): string => {
    // back to 5 days ago
    const expiry = moment(new Date(), "YYYY-MM-DD HH:mm:ss").subtract(5, 'days').format("YYYY-MM-DD HH:mm:ss");
    return `${code.split('|')[0]}|${expiry}`;
};

export const userData = {
    email: 'test_user@test.com',
    password: 'testuser001',
    firstName: 'test_user',
    lastName: 'test_user',
    phoneNumber: '07045626278',
}