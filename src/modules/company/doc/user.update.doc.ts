import errorResponsesDoc from "../../../core/swagger/errorResponses.doc";

const updateCompanyBody = {
    companyId: {
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

export const updateCompany = {
    put: {
        description: 'Update a company data',
        security: [{
            bearerAuth: []
        }],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        required: ['comapnyId'],
                        properties: {
                            ...updateCompanyBody
                        },
                    },
                },
                'multipart/form-data': {
                    schema: {
                        type: 'object',
                        required: ['companyId'],
                        properties: {
                            ...updateCompanyBody,
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
                description: 'Update Company API Success Response Example',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                ...updateCompanyBody
                            },
                        },
                        example: {
                            status: 'success',
                            message: 'Company data updated successfully',
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
                    }
                }
            },
            '404': {
                description: 'Update Company API Error Response Example',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                statusCode: {
                                    type: 'number'
                                },
                            },
                        },
                        example: {
                            status: 'error',
                            statusCode: 404,
                            message: `Company id is required`,
                            data: null
                        },
                    },
                },
            },
            ...errorResponsesDoc(),
        },
    },
}