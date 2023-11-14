import errorResponsesDoc from "../../../core/swagger/errorResponses.doc";

const updateRequestBody = {
    firstName: {
        type: 'string',
    },
    lastName: {
        type: 'string',
    },
    phoneNumber: {
        type: 'string',
    },
}

export const updateUser = {
    put: {
        description: 'Update a user',
        security: [{
            bearerAuth: []
        }],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        required: ['email', 'password',],
                        properties: {
                            ...updateRequestBody
                        },
                    },
                },
                'multipart/form-data': {
                    schema: {
                        type: 'object',
                        properties: {
                            ...updateRequestBody,
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
                description: 'Update user API Success Response Example',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                ...updateRequestBody
                            },
                        },
                        example: {
                            status: 'success',
                            message: 'User data updated successfully',
                            data: {
                                'firstName': 'test_user_fisrtname',
                                'lastName': 'test_user_lastname',
                                'phoneNumber': '+2341111111111',
                                'imageUrl': 'https://user_image_url',
                                'imagePublicId': 'user_image_id',
                                '_id': '652a9deb54f77f7814bfe99f'
                            }
                        },
                    }
                }
            },
            '404': {
                description: 'Update user API Error Response Example',
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