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
  roleType: {
    type: 'string',
  }
};

const signInRequestBody = {
  email: {
    type: 'string',
  },
  password: {
    type: 'string',
  }
};

const verifyAccountBody = {
  userId: {
    type: 'string',
  },
  code: {
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
            required: ['firstName', 'lastName', 'email', 'password', 'phoneNumber'],
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
              profileImage: {
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
                'firstName': 'test_user_fisrtname',
                'lastName': 'test_user_lastname',
                'email': 'test_user_@test.com',
                'phoneNumber': '+2341111111111',
                'imageUrl': 'https://user_image_url',
                'imagePublicId': 'user_image_id',
                'role': {
                  '_id': "652a9deb54f77f7814bfe99f",
                  'name': 'staff',
                  'permissions': ['read', 'write'],
                },
                '_id': '652a9deb54f77f7814bfe99f'
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
              statusCode: 422,
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

export const signInApiDoc = {
  post: {
    description: 'Signin user account',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              ...signInRequestBody
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
                token: {
                  type: 'string'
                }
              },
            },
            example: {
              status: 'success',
              message: 'User signin successful',
              data: {
                'token': '"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJ5eXl5eXl5eXl5eXl5eSIsImxhc3ROYW1lIjoiaGhoaGhoaGhoaGhoaGhoaGhoIiwiZW1haWwiOiJiZ2hwQGhoLmNvbSIsInBob25lTnVtYmVyIjoiNDU4NzUxNDc1MjciLCJpbWFnZVVybCI6Imh0dHBzOi8vcmVzLmNsb3VkaW5hcnkuY29tL2RldHh5dmM4ay9pbWFnZS91cGxvYWQvdjE2OTc4MDI0MzkvcHJvZmlsZV9pbWFnZXMvMjM0XzcwNl83MDVfNDc5OF8yMDE4MDkyMV8yMjUyMjlfd2xubDd5LmpwZyIsImltYWdlUHVibGljSWQiOiJwcm9maWxlX2ltYWdlcy8yMzRfNzA2XzcwNV80Nzk4XzIwMTgwOTIxXzIyNTIyOV93bG5sN3kiLCJyb2xlIjoiNjUzMTRkODk5MDYxZTYxZjcxNjNmN2U1IiwiX2lkIjoiNjUzMjY4YzhkOTc4NzkxMTY3MDBlZDBjIiwiZXhwaXJlQXQiOiIyNGhyIiwiaWF0IjoxNjk3ODAzMTI2fQ.sSk2y1qUDK1Ku1W3m0ttY6Ja7OJD8jsmEN8yBMLA-BY',
              },
            },
          },
        },
      },
      '404': {
        description: 'Invalid login credentials',
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
              statusCode: 404,
              message: 'Invalid credentials. Please check your email and password and try again.',
              data: null
            },
          },
        },
      },
      ...errorResponsesDoc(),
    },
  },
};

export const verifyAccount = {
  post: {
    description: 'Verify user account',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['userId', 'code'],
            properties: {
              ...verifyAccountBody
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
                userId: {
                  type: 'string'
                }
              },
            },
            example: {
              status: 'success',
              message: 'User verification successful',
              data: {
                'userId': '652a9deb54f77f7814bfe99f',
              },
            },
          },
        },
      },
      '404': {
        description: 'The verification code provided is not valid',
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
              statusCode: 404,
              message: 'The verification code provided is not valid.',
              data: null
            },
          },
        },
      },
      ...errorResponsesDoc(),
    },
  },
}