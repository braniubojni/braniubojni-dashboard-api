import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BaseController } from '../common/base.controller';
import { ValidateMiddleware } from '../common/validate.middleware';
import { HTTPError } from '../errors/http-error.class';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { IUserController } from './users.controller.interface';
import { UserService } from './users.service';

@injectable()
export class UserController extends BaseController implements IUserController {
	// call in constructor bind routes
	constructor(
		@inject(TYPES.ILogger) private readonly loggerService: ILogger,
		@inject(TYPES.UserService) private readonly userService: UserService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				name: 'users',
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				name: 'users',
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
		]);
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		// const logged = await this.userService.loginUser(body);
		// if ('code' in logged) return next(new HTTPError(logged.code, logged.msg));
		const result = await this.userService.validateUser(body);
		if (!result) {
			return next(new HTTPError(401, 'Autharization error', 'login'));
		}
		this.ok(res, {});
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const newUser = await this.userService.createUser(body);

		if (!newUser) return next(new HTTPError(422, 'User already exists'));

		this.ok(res, { email: newUser.email, id: newUser.id });
	}
}
