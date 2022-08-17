import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { IAdvandedError, IUserService } from './users.service.interface';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
	) {}
	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, salt);
		const existedUSer = await this.usersRepository.find(email);
		if (existedUSer) {
			return null;
		}

		return await this.usersRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.usersRepository.find(email);
		if (!existedUser) {
			return false;
		}
		const newUser = new User(existedUser.email, existedUser.name, existedUser.password);

		return newUser.comparePassword(password);
	}

	/** 
	 * My implementation of user login
	async loginUser({ email, password }: UserLoginDto): Promise<UserModel | IAdvandedError> {
		const user = await this.usersRepository.find(email);
		if (!user) {
			return { code: 404, msg: 'User not found' };
		}
		const equalPass = await User.verifyPasswd(password, user.password);
		if (!equalPass) {
			return { code: 403, msg: 'Password is incorrect' };
		}
		return user;
	}
	 */
}
