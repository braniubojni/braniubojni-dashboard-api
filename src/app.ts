import express, { Express } from 'express';
import { userRouter } from './users/users';
import { Server } from 'http';
import { LoggerService } from './logger/logger.service';

export class App {
  app: Express;
  server!: Required<Server>;
  port: number;
  logger!: LoggerService

  constructor(logger: LoggerService) {
    this.app = express();
    this.port = 8000;
    this.logger = new LoggerService();
  }

  public useRoutes() {
    this.app.use('/users', userRouter);
  }

  public async init() {
    this.useRoutes();
    let {port, app, server, logger} = this;
    server = app.listen(port, () => logger.log(`Server on ${port}`));
  }
}
