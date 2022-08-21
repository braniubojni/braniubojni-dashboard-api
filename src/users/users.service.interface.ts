import { UserModel } from '@prisma/client';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

export interface IAdvandedError {
	code: number;
	msg: string;
}

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
	getUserInfo: (email: string) => Promise<UserModel | null>;
	deleteUser: (email: string) => Promise<UserModel | null>;
	// loginUser: (dto: UserLoginDto) => Promise<UserModel | IAdvandedError>;
}
