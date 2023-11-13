import errorResponsesDoc from "../../../core/swagger/errorResponses.doc";

export const getUser = {
    get: {
        description: 'Get a user data',
        security: [{
            bearerAuth: []
        }],
        parameters: [
            {
                "name": "userCompanies",
                "description": ":- List of company ID that belongs to the user if list is empty all the users company will be returned",
                "in": "query",
                "required": false,
                "style": "form",
                "explode": true,
                "schema": {
                    "type": "array"
                }
            }
        ],
        responses: {
            '200': {
                description: 'Get user API Success Response Example',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                            },
                        },
                        example: {
                            'status': 'success',
                            'message': 'User data retrieved successfully',
                            'data': {
                                'user': {
                                    'name': 'test user',
                                    'email': 'jidsfotech@gmail.com',
                                    '_id': '6549bb18a00413a90c10d5b1',
                                    'roles': []
                                },
                                'companiesOwnedByUser': [
                                    {
                                        '_id': '6549bbd2a00413a90c10d5b8',
                                        'ownersId': '6549bb18a00413a90c10d5b1',
                                        'name': 'company name',
                                        'staffs': [],
                                        'reference': 'RAKATIA-Np7Wyrzq95370',
                                    },
                                ]
                            },
                        },
                    }
                }
            },
            '404': {
                description: 'Get user API Error Response Example',
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
                            message: `User id is required`,
                            data: null
                        },
                    },
                },
            },
            ...errorResponsesDoc(),
        },
    },
}