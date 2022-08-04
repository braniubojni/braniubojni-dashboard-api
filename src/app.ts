import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { ExeptionFilter } from './errors/exeption.filter';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { UserController } from './users/users.controller';
import { json, BodyParser } from 'body-parser';
import 'reflect-metadata';

@injectable()
export class App {
	app: Express;
	server!: Required<Server>;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExceptionFilter) private exeptionFilter: ExeptionFilter,
	) {
		this.app = express();
		this.port = 8008;
	}

	public useMiddleware(): void {
		this.app.use(json());
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
		const PORT = this.port;
		this.server = this.app.listen(PORT, () => this.logger.log(`Server on ${PORT}`));
	}
}
