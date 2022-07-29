import express, { Express } from 'express';
import { userRouter } from './users/users';
import { Server } from 'http';

export class App {
  app: Express;
  server!: Required<Server>;
  port: number;

  constructor() {
    this.app = express();
    this.port = 8000;
  }

  public useRoutes() {
    this.app.use('/users', userRouter);
  }

  public async init() {
    this.useRoutes();
    let {port, app, server} = this;
    server = app.listen(port, () => console.log(`Server on ${port}`));
  }
}
