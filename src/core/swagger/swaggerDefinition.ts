import swaggerJSDoc from 'swagger-jsdoc';
import {
    signUpApiDoc,
    signInApiDoc,
    verifyAccount,
    resetPassword,
    updatePassword
} from '../../modules/users/doc/user.doc';
import { companySignUpApiDoc } from '../../modules/company/doc/company.doc';

const swaggerDefinition = swaggerJSDoc({
    swaggerDefinition: {
        openapi: '3.1.0',
        info: {
            title: 'Rakatia API',
            version: '1.0.0',
            description: 'Documentation for the Rakatia API',
        },
        paths: {
            '/users/signup': { ...signUpApiDoc },
            '/users/signin': { ...signInApiDoc },
            '/users/verify': { ...verifyAccount },
            '/users/reset-password': { ...resetPassword },
            '/users/update-password': { ...updatePassword },
            '/company/signup': { ...companySignUpApiDoc }
        },
    },
    basePath: '/',
    apis: [],
});

export default swaggerDefinition;
