import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata'

@injectable()
export class UserController extends BaseController {
  // call in constructor bind routes
  constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
    super(loggerService);
    this.bindRoutes([
      { name: 'users', path: '/register', method: 'post', func: this.register },
      { name: 'users', path: '/login', method: 'post', func: this.login }
    ]);
  }

  login(req: Request, res: Response, next: NextFunction) {
    this.ok(res, 'login')
    // next(new HTTPError(401, 'Error created', 'login')); // For testing
  }

  register(req: Request, res: Response, next: NextFunction) {
    this.ok(res, 'register');
  }
}
