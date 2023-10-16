import errorResponsesDoc from "../../../core/swagger/errorResponses.doc";

const signUpRequestBody = {
  firstName: {
    type: 'string',
  },
  lastName: {
    type: 'string',
  },
  email: {
    type: 'string',
  },
  password: {
    type: 'string',
  },
  phoneNumber: {
    type: 'string',
  },
  roleType:{
    type: 'string',
  }
};

export const signUpApiDoc = {
  post: {
    description: 'Creates a new user account',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              ...signUpRequestBody
            },
          },
        },
        'multipart/form-data': {
          schema: {
            type: 'object',
            required: ['firstName', 'lastName', 'email', 'password', 'phoneNumber'],
            properties: {
              ...signUpRequestBody,
              profilePicture: {
                type: 'string',
                format: 'binary',
              },
            },
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Response example',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                data: {
                  type: 'string'
                }
              },
            },
            example: {
              status: 'success',
              message: 'User account created successfully',
              data: {
                'firstName':'test_user_fisrtname',
                'lastName':'test_user_lastname',
                'email':'test_user_@test.com',
                'phoneNumber':'+2341111111111',
                'imageUrl':'https://user_image_url',
                'imagePublicId':'user_image_id',
                'role':{
                  '_id': "652a9deb54f77f7814bfe99f",
                  'name': 'staff',
                  'permissions': [ 'read', 'write'],
                },
                '_id':'652a9deb54f77f7814bfe99f'
              }
            },
          },
        },
      },
      '422': {
        description: 'Unprocessable Entity (validation error)',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string'
                },
                statusCode: {
                  type: 'number'
                },
                message: {
                  type: 'string'
                },
                data: {
                  type: 'string'
                }
              },
            },
            example: {
              status: 'error',
              statusCode:422,
              message: 'email is not a valid email, password is required',
              data: null
            },
          },
        },
      },
      ...errorResponsesDoc(),
    },
  },
};