// jest.useFakeTimers();
import request from 'supertest';
import { app } from '../../../src/app/app';
import {
  ConnectTestDb,
  disconnectTestDb,
  createUser,
  userData,
  clearDb,
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

// Test signup API
describe('Post /users/signup', () => {
  it('should fail when no data is supplied', async () => {
    const createUserResponse = await request(app).post('/users/signup').send({});
    expect(createUserResponse.statusCode).toEqual(422);
    expect(createUserResponse.body.status).toEqual('error');
  });

  it('should fail when email is not supplied', async () => {
    const createUserResponse = await request(app).post('/users/signup')
      .send({ password: 'test001' });
    expect(createUserResponse.body.message).toEqual('email is required');
  });

  it('should fail when invalid email is supplied', async () => {
    const createUserResponse = await request(app).post('/users/signup')
      .send({ password: 'test001', email: 'test.com' });
    expect(createUserResponse.body.message).toEqual('the supplied email is not valid');
  });

  it('should fail when password is not supplied', async () => {
    const createUserResponse = await request(app).post('/users/signup')
      .send({ email: 'test@gmail.com' });
    expect(createUserResponse.body.message).toEqual('password is required');
  });

  it('should fail when invalid password is supplied', async () => {
    const createUserResponse = await request(app).post('/users/signup')
      .send({ email: 'test@gmail.com', password: 12345679 });
    expect(createUserResponse.body.message).toEqual('password must be a string');
  });

  it('should fail when the supplied password is less than 8 characters', async () => {
    const createUserResponse = await request(app).post('/users/signup')
      .send({ email: 'test@gmail.com', password: 'pass' });
    expect(createUserResponse.body.message).toEqual('password nust contain minimum of 8 characters');
  });

  it('should fail when the supplied phone number is less than 11 digits', async () => {
    const createUserResponse = await request(app).post('/users/signup')
      .send({ email: 'test@gmail.com', password: 'pass0011', phoneNumber: '0706705637' });
    expect(createUserResponse.body.message).toEqual('phone number must be min of 11 didgits');
  });

  it('should fail when the supplied phone number is greater than 14 digits', async () => {
    const createUserResponse = await request(app).post('/users/signup')
      .send({ email: 'test@gmail.com', password: 'pass0011', phoneNumber: '07047947373739264' });
    expect(createUserResponse.body.message).toEqual('phone number must be max of 14 didgits');
  });

  it('should fail if user already exist', async () => {
    // add test user 
    const user = await createUser(userData);
    if (user) {
      const createUserResponse = await request(app).post('/users/signup').send(userData);
      expect(createUserResponse.body.message).toEqual('The email provided is already associated with another user\'s account');
      // delete test user
      await removeUser(userData.email);
    }
  });

  it('should fail if phone number already exist', async () => {
    // add test user 
    const user = await createUser(userData);
    if (user) {
      userData.email = 'tester@test.com';
      const createUserResponse = await request(app).post('/users/signup').send(userData);
      expect(createUserResponse.body.message).toEqual('The phoneNumber provided is already associated with another user\'s account');
      // delete test user
      await removeUser(userData.email);
    }
  });

  it('should successfully create a new user', async () => {
    const createUserResponse = await request(app).post('/users/signup').send(userData);
    expect(createUserResponse.body.message).toEqual('User account created successfully');
    // delete test user
    await removeUser(userData.email);
  });
});