import errorResponsesDoc from "../../../core/swagger/errorResponses.doc";

const companySignUpRequestBody = {
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

export const companySignUpApiDoc = {
  post: {
    description: 'Creates a new company account',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['name', 'email', 'phoneNumber', 'address'],
            properties: {
              ...companySignUpRequestBody
            },
          },
        },
        'multipart/form-data': {
          schema: {
            type: 'object',
            required: ['name', 'email', 'phoneNumber', 'address'],
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
        description: 'Comapny Reg API Success Response Example',
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
              message: 'Comapny account created successfully',
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