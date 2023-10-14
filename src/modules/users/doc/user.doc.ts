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
};

export const signUpApiDoc = {
  post: {
    description: 'Creates a new user account',
    requestBody: {
      required: true,
      content: {
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
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              ...signUpRequestBody
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
                "userId": "652ae510d177d76b7508be42",
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