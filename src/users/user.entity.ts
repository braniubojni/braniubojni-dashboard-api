import { hash, compare } from 'bcryptjs';

export class User {
	private _password: string;
	constructor(
		private readonly _email: string,
		private readonly _name: string,
		private readonly passwordHash?: string,
	) {
		if (passwordHash) {
			this._password = passwordHash;
		}
	}

	get email(): string {
		return this._email;
	}

	get name(): string {
		return this._name;
	}

	get password(): string {
		return this._password;
	}

	public async setPassword(pass: string, salt: string): Promise<void> {
		this._password = await hash(pass, +salt);
	}

	// public static async verifyPasswd(plain: string, hash: string): Promise<boolean> {
	// 	return await compare(plain, hash);
	// }

	public async comparePassword(password: string): Promise<boolean> {
		return compare(password, this._password);
	}
}
