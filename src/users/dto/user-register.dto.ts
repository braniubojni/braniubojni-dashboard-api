import { IsEmail, IsString, Max, Min, MinLength } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Invalida email' })
	email: string;

	@MinLength(5)
	@IsString({ message: 'Incorrect password at least 5 characters' })
	password: string;

	@IsString({ message: 'Incorrect name' })
	name: string;
}
