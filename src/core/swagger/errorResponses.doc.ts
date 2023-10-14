
export default () => {
    return {
        '400': {
            description: 'Bad Request',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            error: {
                                type: 'string',
                            },
                            statusCode: {
                                type: 'number'
                            },
                        },
                    },
                    example: {
                        error: 'resource not found',
                        statusCode: 400
                    },
                },
            },
        },
        '500': {
            description: 'Internal server error',
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
                        statusCode: 500,
                        message: 'Internal server error',
                        data: null
                    },
                },
            },
        },
    };
}