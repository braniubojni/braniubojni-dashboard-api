import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';
import { UserModel } from '@prisma/client';
import { ALREADY_EXISTS, AUTH_ERROR, NOT_FOUND } from '../src/users/users.constants';

let application: App;
let jwt = '';
const enum status {
	CREATED = 200,
	NOT_FOUND = 404,
	AUTH_ERROR = 401,
	EXISTS = 422,
}
const userDto = {
	email: 'test' + Math.random() + '@gmail.ru',
	password: 'Abcd1234',
	name: 'MockUser',
};

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('[Users]', () => {
	it('Register - success', async () => {
		const { name, email, password } = userDto;
		await request(application.app)
			.post('/users/register')
			.send({ email, password, name })
			.expect(status.CREATED)
			.then(({ body }: request.Response) => {
				expect(body).not.toBeNull();
				expect(body).not.toBeUndefined();
				expect(body.email).toBeDefined();
				expect(body.id).toBeDefined();
				expect(body.id).toBeGreaterThan(0);
			});
	});

	it('Register - fail', async () => {
		const { name, email, password } = userDto;
		await request(application.app)
			.post('/users/register')
			.expect(status.EXISTS)
			.send({ email, password, name })
			.then(({ body }: request.Response) => {
				expect(body.err).toBeDefined();
				expect(body.err).toEqual(ALREADY_EXISTS);
			});
	});

	it('Login - success', async () => {
		const { email, password } = userDto;
		await request(application.app)
			.post('/users/login')
			.send({ email, password })
			.then(({ body }: request.Response) => {
				expect(body).not.toBeNull();
				expect(body).not.toBeUndefined();
				expect(body.jwt).toBeDefined();
				jwt = body.jwt;
			});
	});

	it('Info - success', async () => {
		await request(application.app)
			.get('/users/info')
			.then(({ body }: request.Response) => {
				console.log(body, '<-- should be issue');
			});
	});

	it('Login - fail', async () => {
		const { email, password } = userDto;
		await request(application.app)
			.post('/users/login')
			.send({ email: email + 'fail', password })
			.expect(status.AUTH_ERROR)
			.then(({ body }: request.Response) => {
				expect(body.err).toBeDefined();
				expect(body.err).toEqual(AUTH_ERROR);
			});
	});

	it('Delete - success', async () => {
		const { email, name } = userDto;
		await request(application.app)
			.delete('/users/delete')
			.send({ email })
			.then(({ body }: request.Response) => {
				expect(body).not.toBeNull();
				expect(body).not.toBeUndefined();
				expect(body.email).toBeDefined();
				expect(body.email).toEqual(email);
				expect(body.name).toBeDefined();
				expect(body.name).toEqual(name);
			});
	});

	it('Delete - fail', async () => {
		const { email, name } = userDto;
		await request(application.app)
			.delete('/users/delete')
			.send({ email: email + 5 })
			.then(({ body }: request.Response) => {
				expect(body.err).toBeDefined();
				expect(body.err).toEqual(NOT_FOUND);
			});
	});
});

afterAll(() => {
	application.close();
});
