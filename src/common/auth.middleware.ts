import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { IMiddleware } from './middleware.interface';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			const [bearer, token] = req.headers.authorization.split(' ');
			if (!bearer || !token) return next();

			verify(token, this.secret, (err, payload) => {
				if (err) {
					next();
				}
				if (payload && typeof payload !== 'string') {
					req.user = payload.email;
					next();
				}
			});
		}
		next();
	}
}
