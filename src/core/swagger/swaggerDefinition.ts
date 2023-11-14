import swaggerJSDoc from 'swagger-jsdoc';
import {
    signUpApiDoc,
    signInApiDoc,
    verifyAccount,
    resetPassword,
    updatePassword,
} from '../../modules/users/doc/user.auth.doc';
import { getUser } from '../../modules/users/doc/user.get.doc';
import { updateUser } from '../../modules/users/doc/user.update.doc';
import {
    createComapnyApiDoc,
    sendInvitationApiDoc,
    acceptInvitationApiDoc
} from '../../modules/company/doc/company.doc';

const swaggerDefinition = swaggerJSDoc({
    swaggerDefinition: {
        openapi: '3.1.0',
        info: {
            title: 'Rakatia API',
            version: '1.0.0',
            description: 'Documentation for the Rakatia API',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        paths: {
            '/users/signup': { ...signUpApiDoc },
            '/users/signin': { ...signInApiDoc },
            '/users/verify': { ...verifyAccount },
            '/users/reset-password': { ...resetPassword },
            '/users/update-password': { ...updatePassword },
            '/company/create': { ...createComapnyApiDoc },
            '/company/send-invitation': { ...sendInvitationApiDoc },
            '/company/accept-invitation': { ...acceptInvitationApiDoc },
            '/users': { ...getUser },
            '/users/update': { ...updateUser },
        },
    },
    basePath: '/',
    apis: [],
});

export default swaggerDefinition;
