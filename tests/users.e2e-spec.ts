import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';
import { ALREADY_EXISTS, AUTH_ERROR, NOT_FOUND, UNAUTHORIZED } from '../src/users/users.constants';

let application: App;
let jwt = 'Bearer ';
let deletedJwt = 'Bearer ';
const enum status {
	CREATED = 201,
	OK = 200,
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
	it('Register - success (1)', async () => {
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

	it('Register - success (2)', async () => {
		const { name, email, password } = userDto;
		await request(application.app)
			.post('/users/register')
			.send({ email: '1' + email, password: '1' + password, name: '1' + name })
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

	it('Login - success (1)', async () => {
		const { email, password } = userDto;
		await request(application.app)
			.post('/users/login')
			.send({ email, password })
			.then(({ body }: request.Response) => {
				expect(body).not.toBeNull();
				expect(body).not.toBeUndefined();
				expect(body.jwt).toBeDefined();
				jwt += body.jwt;
			});
	});

	it('Login - success (2)', async () => {
		const { email, password } = userDto;
		await request(application.app)
			.post('/users/login')
			.send({ email: '1' + email, password: '1' + password })
			.then(({ body }: request.Response) => {
				deletedJwt += body.jwt;
			});
	});

	it('Delete - success (1)', async () => {
		const { email, name } = userDto;
		await request(application.app)
			.delete('/users/delete')
			.set('Authorization', jwt)
			.send({ email: '1' + email })
			.then(({ body }: request.Response) => {
				expect(body).not.toBeNull();
				expect(body).not.toBeUndefined();
				expect(body.email).toBeDefined();
				expect(body.email).toEqual('1' + email);
				expect(body.name).toBeDefined();
				expect(body.name).toEqual('1' + name);
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

	it('Info - success', async () => {
		const { email, name } = userDto;
		await request(application.app)
			.get('/users/info')
			.set('Authorization', jwt)
			.expect(status.OK)
			.then(({ body }: request.Response) => {
				expect(body).not.toBeNull();
				expect(body).not.toBeUndefined();
				expect(body.email).toBeDefined();
				expect(body.name).toBeDefined();

				expect(body.email).toEqual(email);
				expect(body.name).toEqual(name);
			});
	});

	it('Info - fail (1)', async () => {
		const { email, name } = userDto;
		await request(application.app)
			.get('/users/info')
			.set('Authorization', jwt + 1)
			.expect(status.AUTH_ERROR)
			.then(({ body }: request.Response) => {
				expect(body.err).toBeDefined();
				expect(body.err).toEqual(UNAUTHORIZED);
			});
	});

	it('Info - fail (2)', async () => {
		const { email, name } = userDto;
		await request(application.app)
			.get('/users/info')
			.set('Authorization', deletedJwt)
			.expect(status.NOT_FOUND)
			.then(({ body }: request.Response) => {
				expect(body.err).toBeDefined();
				expect(body.err).toEqual(NOT_FOUND);
			});
	});

	it('Delete - success (2)', async () => {
		const { email, name } = userDto;
		await request(application.app)
			.delete('/users/delete')
			.set('Authorization', jwt)
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
			.set('Authorization', jwt)
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
