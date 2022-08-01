import express, { Express } from 'express';
import { userRouter } from './users/users';
import { Server } from 'http';
import { LoggerService } from './logger/logger.service';
import { UserController } from './users/users.controller';

export class App {
  app: Express;
  server!: Required<Server>;
  port: number;
  logger!: LoggerService
  userController: UserController

  constructor(logger: LoggerService, userController: UserController) {
    this.app = express();
    this.port = 8000;
    this.logger = logger;
    this.userController = userController
  }

  public useRoutes() {
    this.app.use('/users', this.userController.router);
  }

  public async init() {
    this.useRoutes();
    let {port, app, server, logger} = this;
    server = app.listen(port, () => logger.log(`Server on ${port}`));
  }
}
