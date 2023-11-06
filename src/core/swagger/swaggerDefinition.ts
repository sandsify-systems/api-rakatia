import swaggerJSDoc from 'swagger-jsdoc';
import {
    signUpApiDoc,
    signInApiDoc,
    verifyAccount,
    resetPassword,
    updatePassword,
} from '../../modules/users/doc/user.doc';
import {
    companySignUpApiDoc,
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
        security: [{
            bearerAuth: []
        }],
        paths: {
            '/users/signup': { ...signUpApiDoc },
            '/users/signin': { ...signInApiDoc },
            '/users/verify': { ...verifyAccount },
            '/users/reset-password': { ...resetPassword },
            '/users/update-password': { ...updatePassword },
            '/company/create': { ...companySignUpApiDoc },
            '/company/send-invitation': { ...sendInvitationApiDoc },
            '/company/accept-invitation': { ...acceptInvitationApiDoc }
        },
    },
    basePath: '/',
    apis: [],
});

export default swaggerDefinition;
