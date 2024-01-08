// jest.useFakeTimers();
import request from 'supertest';
import { app } from '../../src/app/app';
import {
  ConnectTestDb,
  disconnectTestDb,
  createUser,
  userData,
  clearDb,
  updateUser,
  createExpiredCode,
} from '../db/db';

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

// // Test signup API
// describe('Post /users/signup', () => {
//   it('should fail when no data is supplied', async () => {
//     const createUserResponse = await request(app).post('/users/signup').send({});
//     expect(createUserResponse.statusCode).toEqual(422);
//     expect(createUserResponse.body.status).toEqual('error');
//   });

//   it('should fail when email is not supplied', async () => {
//     const createUserResponse = await request(app).post('/users/signup')
//       .send({ password: 'test001' });
//     expect(createUserResponse.body.message).toEqual('email is required');
//   });

//   it('should fail when invalid email is supplied', async () => {
//     const createUserResponse = await request(app).post('/users/signup')
//       .send({ password: 'test001', email: 'test.com' });
//     expect(createUserResponse.body.message).toEqual('the supplied email is not valid');
//   });

//   it('should fail when password is not supplied', async () => {
//     const createUserResponse = await request(app).post('/users/signup')
//       .send({ email: 'test@gmail.com' });
//     expect(createUserResponse.body.message).toEqual('password is required');
//   });

//   it('should fail when invalid password is supplied', async () => {
//     const createUserResponse = await request(app).post('/users/signup')
//       .send({ email: 'test@gmail.com', password: 12345679 });
//     expect(createUserResponse.body.message).toEqual('password must be a string');
//   });

//   it('should fail when the supplied password is less than 8 characters', async () => {
//     const createUserResponse = await request(app).post('/users/signup')
//       .send({ email: 'test@gmail.com', password: 'pass' });
//     expect(createUserResponse.body.message).toEqual('password nust contain minimum of 8 characters');
//   });

//   it('should fail when the supplied phone number is less than 11 digits', async () => {
//     const createUserResponse = await request(app).post('/users/signup')
//       .send({ email: 'test@gmail.com', password: 'pass0011', phoneNumber: '0706705637' });
//     expect(createUserResponse.body.message).toEqual('phone number must be min of 11 didgits');
//   });

//   it('should fail when the supplied phone number is greater than 14 digits', async () => {
//     const createUserResponse = await request(app).post('/users/signup')
//       .send({ email: 'test@gmail.com', password: 'pass0011', phoneNumber: '07047947373739264' });
//     expect(createUserResponse.body.message).toEqual('phone number must be max of 14 didgits');
//   });

//   it('should fail if user already exist', async () => {
//     // add test user 
//     const user = await createUser(userData);
//     if (user) {
//       const createUserResponse = await request(app).post('/users/signup').send(userData);
//       expect(createUserResponse.body.message).toEqual('The email provided is already associated with another user\'s account');
//       // delete test user
//       await removeUser(userData.email);
//     }
//   });

//   it('should fail if phone number already exist', async () => {
//     // add test user 
//     const user = await createUser(userData);
//     if (user) {
//       userData.email = 'tester@test.com';
//       const createUserResponse = await request(app).post('/users/signup').send(userData);
//       expect(createUserResponse.body.message).toEqual('The phoneNumber provided is already associated with another user\'s account');
//       // delete test user
//       await removeUser(userData.email);
//     }
//   });

//   it('should successfully create a new user', async () => {
//     const createUserResponse = await request(app).post('/users/signup').send(userData);
//     expect(createUserResponse.body.message).toEqual('User account created successfully');
//     // delete test user
//     await removeUser(userData.email);
//   });
// });

// // Test login API
// describe('Post /users/login', () => {
//   it('should fail when no data is supplied', async () => {
//     const createUserResponse = await request(app).post('/users/signin').send({});
//     expect(createUserResponse.statusCode).toEqual(422);
//     expect(createUserResponse.body.status).toEqual('error');
//   });

//   it('should fail when email is not supplied', async () => {
//     const userLoginResponse = await request(app).post('/users/signin')
//       .send({ password: 'test0001' });
//     expect(userLoginResponse.body.message).toEqual('email is required');
//   });

//   it('should fail when password is not supplied', async () => {
//     const userLoginResponse = await request(app).post('/users/signin')
//       .send({ email: 'test@gmail.com' });
//     expect(userLoginResponse.body.message).toEqual('password is required');
//   });

//   it('should fail when user does not exist', async () => {
//     const userLoginResponse = await request(app).post('/users/signin')
//       .send({ email: 'testuser@gmail.com', password: 'test1234' });
//     expect(userLoginResponse.body.message).toEqual('There\'s no user account associated with this email:- testuser@gmail.com');
//   });

//   it('should fail when user is not verified', async () => {
//     // add test user 
//     const user = await createUser(userData);
//     if (user) {
//       const userLoginResponse = await request(app).post('/users/signin').send(userData);
//       expect(userLoginResponse.body.message).toEqual('The account associated with this email is not verified. Please check your email for a new verification link');
//       // delete test user
//       await removeUser(userData.email);
//     }
//   });

//   it('should login user successfully', async () => {
//     // add test user 
//     const user = await createUser(userData);
//     if (user) {
//       await updateUser({ _id: user._id }, { isVerified: true });
//       const userLoginResponse = await request(app).post('/users/signin').send(userData);
//       expect(userLoginResponse.body.message).toEqual('The account associated with this email is not verified. Please check your email for a new verification link');
//       // delete test user
//       await removeUser(userData.email);
//     }
//   });
// });

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