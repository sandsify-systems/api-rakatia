import swaggerJSDoc from 'swagger-jsdoc';
import { 
    signUpApiDoc,
    signInApiDoc
 } from '../../modules/users/doc/user.doc';

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
            '/users/signin': {
                ...signInApiDoc,
            },
        },
    },
    basePath: '/',
    apis: [],
});

export default swaggerDefinition;
