import { Request, Response, NextFunction } from 'express';
import { log } from './logger'
import jwt from 'jsonwebtoken';
import { IDecodedToken } from '../../modules/users/dto/user.dto';
import { Exception } from './errorhandler';

// Get token from headers
export const getAuthToken = (req: Request) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const token: string = req.headers.authorization.split(' ')[1];
    return token;
  } else {
    return null;
  }
};



export interface CustomRequest extends Request {
  token: IDecodedToken | null;
}

// Verify token
export const authoriseRequest = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const token = getAuthToken(req);
    if (!token) {
      throw new Exception('Unathorised request, missing auth token', 401);
    }
    const { JWT_SECRET } = process.env;
    const decoded = jwt.verify(token, JWT_SECRET as string) as IDecodedToken;
    if (!decoded) {
      throw new Exception('Unathorised request, invalid or expired token', 401);
    }

    req.token = <IDecodedToken>decoded;
    log.info('Request authorised');
    next();
  } catch (err: any) {
    log.error({ message: 'Authorization error' }, err);
    next(err);
  }
}