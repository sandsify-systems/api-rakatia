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

const updatePasswordRequestBody = {
  userId: {
    type: 'string',
  },
  code: {
    type: 'string',
  },
  newPassword: {
    type: 'string',
  },
}

const responseProperties = {
  status: {
    type: 'string'
  },
  message: {
    type: 'string'
  },
  data: {
    type: 'string'
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
        description: 'Singup API Success Response Example',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                ...responseProperties
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
                '_id': '652a9deb54f77f7814bfe99f'
              }
            },
          },
        },
      },
      '422': {
        description: 'Signup API Error Response Example',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                statusCode: {
                  type: 'number'
                },
                ...responseProperties
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
        description: 'Signin API Success Response Example',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                ...responseProperties
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
        description: 'Singin API Error Response Example',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                statusCode: {
                  type: 'number'
                },
                ...responseProperties
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
        description: 'Verify Account API Success Response Example',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                ...responseProperties
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
        description: 'Verify Account API Error Response Example',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                statusCode: {
                  type: 'number'
                },
                ...responseProperties
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
}

export const resetPassword = {
  post: {
    description: 'Reset password',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email'],
            properties: {
              email: {
                type: 'string',
              }
            },
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Reset password API Success Response Example',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                ...responseProperties
              },
            },
            example: {
              status: 'success',
              message: 'Password reset link has been sent to your email',
              data: null
            },
          },
        },
      },
      '404': {
        description: 'Resest Password API Error Response Example',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                statusCode: {
                  type: 'number'
                },
                ...responseProperties
              },
            },
            example: {
              status: 'error',
              statusCode: 404,
              message: `User not found. There's no account associated with the email Please proceed to the registration page to create a new account.`,
              data: null
            },
          },
        },
      },
      ...errorResponsesDoc(),
    },
  },
}

export const updatePassword = {
  post: {
    description: 'Update password',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email'],
            properties: {
              ...updatePasswordRequestBody
            },
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Update Password API Success Response Example',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                ...responseProperties
              },
            },
            example: {
              status: 'success',
              message: 'Password updated successfully',
              data: null
            },
          },
        },
      },
      '404': {
        description: 'Update Password API Error Response Example',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                statusCode: {
                  type: 'number'
                },
                ...responseProperties
              },
            },
            example: {
              status: 'error',
              statusCode: 404,
              message: `Invalid password reset code`,
              data: null
            },
          },
        },
      },
      ...errorResponsesDoc(),
    },
  },
}