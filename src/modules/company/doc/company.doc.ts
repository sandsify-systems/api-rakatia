import errorResponsesDoc from "../../../core/swagger/errorResponses.doc";

const companySignUpRequestBody = {
  ownersId: {
    type: 'string',
  },
  name: {
    type: 'string',
  },
  email: {
    type: 'string',
  },
  phoneNumber: {
    type: 'string',
  },
  address: {
    type: 'string',
  },
  industry: {
    type: 'string',
  },
  website: {
    type: 'string',
  }
};

const sendInvitationRequestBody = {
  sendersId: { type: 'string' },
  companyId: { type: 'string' },
  inviteeEmail: { type: 'string' },
  role: { type: 'string' }
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

export const createComapnyApiDoc = {
  post: {
    description: 'Creates a new company',
    security: [{
      bearerAuth: []
    }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['name', 'ownersId'],
            properties: {
              ...companySignUpRequestBody
            },
          },
        },
        'multipart/form-data': {
          schema: {
            type: 'object',
            required: ['name', 'ownersId'],
            properties: {
              ...companySignUpRequestBody,
              logo: {
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
        description: 'Comapny Setup API Success Response Example',
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
              message: 'Comapny created successfully',
              data: {
                'name': 'comapny_name',
                'email': 'company@test.com',
                'phoneNumber': '+2341111111111',
                'logoUrl': 'https://user_image_url',
                'logoPublicId': 'user_image_id',
                'address': 'comapny_address',
                'website': 'comapany_website',
                '_id': '652a9deb54f77f7814bfe99f'
              }
            },
          },
        },
      },
      '422': {
        description: 'Comapny Signup API Error Response Example',
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
              message: 'comapny name is required',
              data: null
            },
          },
        },
      },
      ...errorResponsesDoc(),
    },
  },
};

export const sendInvitationApiDoc = {
  post: {
    description: 'Sends invitation to a user to join a company',
    security: [{
      bearerAuth: []
    }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['sendersId', 'companyId', 'inviteeEmail'],
            properties: {
              ...sendInvitationRequestBody
            },
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Send invitation API Success Response Example',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                ...sendInvitationRequestBody
              },
            },
            example: {
              status: 'success',
              message: 'Invitation sent successfully',
              data: null
            },
          },
        },
      },
      '422': {
        description: 'Send invitation API Error Response Example',
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
              message: 'company sendersId is required',
              data: null
            },
          },
        },
      },
      ...errorResponsesDoc(),
    },
  },
};

export const acceptInvitationApiDoc = {
  post: {
    description: 'Accept invitation to join a company',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['invitationId'],
            properties: {
              invitationId: { type: 'string' }
            },
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Accept invitation API Success Response Example',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                invitationId: { type: 'string' }
              },
            },
            example: {
              status: 'success',
              message: 'Invitation accepted successfully',
              data: null
            },
          },
        },
      },
      '422': {
        description: 'Accept invitation API Error Response Example',
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
              message: 'invitationId is required',
              data: null
            },
          },
        },
      },
      ...errorResponsesDoc(),
    },
  },
};