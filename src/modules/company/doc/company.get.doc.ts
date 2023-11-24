import errorResponsesDoc from "../../../core/swagger/errorResponses.doc";

export const getCompany = {
    get: {
        description: 'Get companies owned by a user',
        security: [{
            bearerAuth: []
        }],
        parameters: [
            {
                "name": "companyId",
                "description": ":- all the users company will be returned if no companyId is provided",
                "in": "query",
                "required": false,
                "style": "form",
                "explode": true,
                "schema": {
                    "type": "string"
                }
            }
        ],
        responses: {
            '200': {
                description: 'Get company API Success Response Example',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: [
                                {
                                    "name": "companyId",
                                    "description": ":- List of company ID that belongs to the user if list is empty all the users company will be returned",
                                }
                            ],
                        },
                    example: {
                        'status': 'success',
                        'message': 'Company retrieved successfully',
                        'data': [{
                            '_id': '6549bbd2a00413a90c10d5b8',
                            'ownersId': '6549bb18a00413a90c10d5b1',
                            'name': 'company name',
                            'staffs': [],
                            'reference': 'RAKATIA-Np7Wyrzq95370',
                        }]
                    },
                },
                },
            },
            '404': {
                description: 'Get ompany API Error Response Example',
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
    }
}