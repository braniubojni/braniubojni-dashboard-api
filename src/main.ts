import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ExeptionFilter } from './errors/exeption.filter';
import { IExceptionFilter } from './errors/exeption.filter.interface';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { UserController } from './users/users.controller';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService);
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExeptionFilter);
	bind<UserController>(TYPES.UserController).to(UserController);
	bind<App>(TYPES.Application).to(App);
});

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return {
		appContainer,
		app,
	};
}

export const { app, appContainer } = bootstrap();
