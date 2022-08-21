import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { sign } from 'jsonwebtoken';
import 'reflect-metadata';
import { AuthGuard } from '../common/auth.guard';
import { BaseController } from '../common/base.controller';
import { ValidateMiddleware } from '../common/validate.middleware';
import { IConfigService } from '../config/config.service.interface';
import { HTTPError } from '../errors/http-error.class';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { ALREADY_EXISTS, AUTH_ERROR, NOT_FOUND } from './users.constants';
import { IUserController } from './users.controller.interface';
import { UserService } from './users.service';

@injectable()
export class UserController extends BaseController implements IUserController {
	// call in constructor bind routes
	constructor(
		@inject(TYPES.ILogger) private readonly loggerService: ILogger,
		@inject(TYPES.UserService) private readonly userService: UserService,
		@inject(TYPES.ConfigService) private readonly configService: IConfigService,
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
			{
				name: 'users',
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuard()],
			},
			{
				name: 'users',
				path: '/delete',
				method: 'delete',
				func: this.delete,
				middlewares: [new AuthGuard()],
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
			return next(new HTTPError(401, AUTH_ERROR, 'login'));
		}
		const jwt = await this.signJWT(body.email, this.configService.get('SECRET') || 'secret-789');
		this.ok(res, { jwt });
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const newUser = await this.userService.createUser(body);

		if (!newUser) return next(new HTTPError(422, ALREADY_EXISTS));

		this.created(res, { email: newUser.email, id: newUser.id });
	}

	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user);

		if (!userInfo) {
			return next(new HTTPError(404, NOT_FOUND));
		}

		this.ok(res, { email: userInfo.email, name: userInfo.name });
	}

	async delete({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		const deletedUser = await this.userService.deleteUser(body.email);

		if (!deletedUser) return next(new HTTPError(404, NOT_FOUND));

		this.ok(res, { email: deletedUser.email, name: deletedUser.name });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((res, rej) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						rej(err);
					}
					res(token as string);
				},
			);
		});
	}
}
