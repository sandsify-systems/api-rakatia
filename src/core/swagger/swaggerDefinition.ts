import swaggerJSDoc from 'swagger-jsdoc';
import { signUpApiDoc } from '../../modules/users/doc/user.doc';

const swaggerDefinition = swaggerJSDoc({
    swaggerDefinition: {
        openapi: '3.1.0',
        info: {
            title: 'Rakatia API',
            version: '1.0.0',
            description: 'Documentation for the Rakatia API',
        },
        paths: {
            '/users/signup': {
                ...signUpApiDoc,
            },
        },
    },
    basePath: '/',
    apis: [],
});

export default swaggerDefinition;
