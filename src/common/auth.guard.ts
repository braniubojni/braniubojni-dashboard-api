import { Request, Response, NextFunction } from 'express';
import { UNAUTHORIZED } from '../users/users.constants';
import { IMiddleware } from './middleware.interface';

export class AuthGuard implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.user) {
			return next();
		}
		res.status(401).send({ err: UNAUTHORIZED });
	}
}
