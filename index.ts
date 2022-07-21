import express, { NextFunction, Request, Response } from 'express';
import { userRouter } from './users/users.js';
const port = 8000;
const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('Time ', new Date(Date.now()));
  next();
});

app.get('/hello', (req: Request, res: Response) => {
  console.log('Then I');
  res.send('Hello');
});

app.use('/users', userRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err.message);
  res.status(500).send(err.message);
});

app.listen(port, () => console.log(`Server at http://localhost:${port}`));
