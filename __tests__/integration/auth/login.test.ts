// jest.useFakeTimers();
import request from 'supertest';
import { app } from '../../../src/app/app';
import {
    ConnectTestDb,
    disconnectTestDb,
    createUser,
    userData,
    clearDb,
    updateUser,
    removeUser,
} from '../../db/db';

/**
 * runs and Stub
 */
beforeAll(async () => {
    await ConnectTestDb();
});


/**
  * Execute berfore each test
 */
beforeEach(async () => await clearDb());

/**
 * Execute after all test
 */
afterAll(async () => {
    await clearDb();
    await disconnectTestDb();
});


// Test login API
describe('Post /users/login', () => {
    it('should fail when no data is supplied', async () => {
        const createUserResponse = await request(app).post('/users/signin').send({});
        expect(createUserResponse.statusCode).toEqual(422);
        expect(createUserResponse.body.status).toEqual('error');
    });

    it('should fail when email is not supplied', async () => {
        const userLoginResponse = await request(app).post('/users/signin')
            .send({ password: 'test0001' });
        expect(userLoginResponse.body.message).toEqual('email is required');
    });

    it('should fail when password is not supplied', async () => {
        const userLoginResponse = await request(app).post('/users/signin')
            .send({ email: 'test@gmail.com' });
        expect(userLoginResponse.body.message).toEqual('password is required');
    });

    it('should fail when user does not exist', async () => {
        const userLoginResponse = await request(app).post('/users/signin')
            .send({ email: 'testuser@gmail.com', password: 'test1234' });
        expect(userLoginResponse.body.message).toEqual('There\'s no user account associated with this email:- testuser@gmail.com');
    });

    it('should fail when user is not verified', async () => {
        // add test user 
        const user = await createUser(userData);
        if (user) {
            const userLoginResponse = await request(app).post('/users/signin').send(userData);
            expect(userLoginResponse.body.message).toEqual('The account associated with this email is not verified. Please check your email for a new verification link');
            // delete test user
            //await removeUser(userData.email);
        }
    });

    it('should login user successfully', async () => {
        // add test user 
        const user = await createUser(userData);
        if (user) {
            await updateUser({ _id: user._id }, { isVerified: true });
            const userLoginResponse = await request(app).post('/users/signin').send(userData);
            expect(userLoginResponse.body.message).toEqual('User signin successful');
            // delete test user
            await removeUser(userData.email);
        }
    });
});