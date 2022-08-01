import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { LoggerService } from '../logger/logger.service';

export class UserController extends BaseController {
  // call in constructor bind routes
  constructor(logger: LoggerService) {
    super(logger);
    this.bindRoutes([
      { name: 'users', path: '/register', method: 'post', func: this.register },
      { name: 'users', path: '/login', method: 'post', func: this.login },
    ]);
  }

  login(req: Request, res: Response, next: NextFunction) {
		this.ok(res, 'login')
	}

  register(req: Request, res: Response, next: NextFunction) {
		this.ok(res, 'register')
	}
}
