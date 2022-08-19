import 'reflect-metadata';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { UserService } from './users.service';
import { IUserService } from './users.service.interface';
import { UserModel } from '@prisma/client';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};
const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUserService;
let createdUser: UserModel | null;
const NAME = 'Giqor';
const EMAIL = 'test123@mail.com';
const PASSWORD = '1';

beforeAll(() => {
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);
	container.bind<IUserService>(TYPES.UserService).to(UserService);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	usersService = container.get<IUserService>(TYPES.UserService);
});

describe('[UserService]', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce((user: User) => ({
			id: 1,
			name: user.name,
			email: user.email,
			password: user.password,
		}));

		createdUser = await usersService.createUser({
			email: EMAIL,
			name: NAME,
			password: PASSWORD,
		});
		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.name).toEqual(NAME);
		expect(createdUser?.email).toEqual(EMAIL);
		expect(createdUser?.password).not.toEqual('1');
	});

	it('validateUser - success', async () => {
		usersRepository.find = jest.fn().mockReturnValue(createdUser);

		const isValidUser = await usersService.validateUser({
			email: EMAIL,
			password: PASSWORD,
		});
		expect(isValidUser).toBeTruthy();
	});

	it('validateUser - fail (incorrect password)', async () => {
		usersRepository.find = jest.fn().mockReturnValue(createdUser);
		const wrongPass = PASSWORD + 'fail';
		const isValidUser = await usersService.validateUser({
			email: EMAIL,
			password: wrongPass,
		});
		expect(wrongPass).not.toEqual(PASSWORD);
		expect(isValidUser).toBeFalsy();
	});

	it('validateUser - fail (user not found)', async () => {
		usersRepository.find = jest.fn().mockReturnValue(null);
		const wrongUser = EMAIL + 'borodach';
		const isValidUser = await usersService.validateUser({
			email: wrongUser,
			password: PASSWORD,
		});
		console.log(wrongUser);
		expect(wrongUser).not.toEqual(EMAIL);
		expect(isValidUser).toBeFalsy();
	});
});
