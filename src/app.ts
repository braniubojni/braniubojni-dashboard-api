import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { ExeptionFilter } from './errors/exeption.filter';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { UserController } from './users/users.controller';
import 'reflect-metadata'

@injectable()
export class App {
  app: Express;
  server!: Required<Server>;
  port: number;

  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.UserController) private userController: UserController,
    @inject(TYPES.ExceptionFilter) private exeptionFilter: ExeptionFilter
  ) {
    this.app = express();
    this.port = 8000;
  }

  public useRoutes() {
    this.app.use('/users', this.userController.router);
  }

  public useExeptionFilters() {
    this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
  }

  public async init() {
    this.useRoutes();
    this.useExeptionFilters();
    let { port, app, server, logger } = this;
    server = app.listen(port, () => logger.log(`Server on ${port}`));
  }
}
