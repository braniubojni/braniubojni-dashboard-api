import { json } from 'body-parser';
import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { AuthMiddleware } from './common/auth.middleware';
import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';
import { IExceptionFilter } from './errors/exeption.filter.interface';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { UserController } from './users/users.controller';
import { UsersRepository } from './users/users.repository';

@injectable()
export class App {
	app: Express;
	server!: Required<Server>;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExceptionFilter) private exeptionFilter: IExceptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.UsersRepository) private usersRepository: UsersRepository,
	) {
		this.app = express();
		this.port = 8008;
	}

	public useMiddleware(): void {
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET') || 'secret-789');
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	public useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	public useExeptionFilters(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExeptionFilters();
		await this.prismaService.connect();
		const PORT = this.port;
		this.server = this.app.listen(PORT, () => this.logger.log(`Server on ${PORT}`));
	}
}
