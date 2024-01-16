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
  createExpiredCode,
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

// Test Verify User API
describe('Post /users/verify', () => {
  it('should fail when no data is supplied', async () => {
    const createUserResponse = await request(app).post('/users/verify').send({});
    expect(createUserResponse.statusCode).toEqual(422);
    expect(createUserResponse.body.status).toEqual('error');
  });

  it('should fail when userId is not supplied', async () => {
    const userVerificationResponse = await request(app).post('/users/verify')
      .send({ code: 'code' });
      const {message} = userVerificationResponse.body;
    expect(message).toEqual('user id is required');
  });

  it('should fail when code is not supplied', async () => {
    const userVerificationResponse = await request(app).post('/users/verify')
      .send({ userId: 'userId' });
      const {message} = userVerificationResponse.body;
    expect(message).toEqual('verification code is required');
  });

  it('should fail when the supplied userId is not valid', async () => {
    const userVerificationResponse = await request(app).post('/users/verify')
      .send({ userId: 'fffse32t44', code: 'code' });
    const { message } = userVerificationResponse.body;
    expect(message).toEqual(`The given ID:- "fffse32t44" is not a valid model ID fomart`);
  });

  it('should fail when the supplied userId does not exist', async () => {
    const userVerificationResponse = await request(app).post('/users/verify')
      .send({ userId: '6549bb18a00413a90c10d5b1', code: 'code' });
    const { message } = userVerificationResponse.body;
    expect(message).toEqual(`There's no user account associated with the provided userId`);
  });

  it('should say user already verified', async () => {
    // add test user
    const user = await createUser(userData);
    if (user) {
      // update user properti isVerified to true
      await updateUser({ _id: user._id }, { isVerified: true });
      const userVerificationResponse = await request(app).post('/users/verify')
        .send({ userId: user._id, code: 'code' });
      const { message } = userVerificationResponse.body;
      expect(message).toEqual('Account already verified please proceed to login');
    }
  });

  it('should fail when verification code has expired', async () => {
    // add test user
    const user = await createUser(userData);
    if (user) {
      const expiredCode = createExpiredCode(user.code);
      // update user code with the expired code 
      await updateUser({ _id: user._id }, { code: expiredCode });
      const userVerificationResponse = await request(app).post('/users/verify')
        .send({ userId: user._id, code: expiredCode });
      const { message } = userVerificationResponse.body;
      expect(message).toEqual('verification link has expired please check your email for a new link');
    }
  }, 10000);

  it('should fail when verification code is not valid', async () => {
    // add test user
    const user = await createUser(userData);
    if (user) {
      const userVerificationResponse = await request(app).post('/users/verify')
        .send({ userId: user._id, code: 'wrong code' });
      const { message } = userVerificationResponse.body;
      expect(message).toEqual('The verification code provided is not valid');
    }
  });

  it('should verify a user succesfully', async () => {
    // add test user
    const user = await createUser(userData);
    if (user) {
      const code = user.code.split('|')[0];
      const userVerificationResponse = await request(app).post('/users/verify')
        .send({ userId: user._id, code: code });
      const { message } = userVerificationResponse.body;
      expect(message).toEqual('User verification successful');
    }
  }, 10000);
})