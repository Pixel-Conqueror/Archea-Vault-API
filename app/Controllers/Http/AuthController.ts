import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import AuthValidator from 'App/Validators/AuthValidator';
import RegisterValidator from 'App/Validators/RegisterValidator';

export default class AuthController {
	public async register({ request, response }: HttpContextContract) {
		try {
			const datas = await request.validate(RegisterValidator);
			const user = await User.create(datas);

			return user;
		} catch (error) {
			return response.badRequest({ message: error.messages, error: error });
		}
	}

	public async login({ request, response, auth }: HttpContextContract) {
		try {
			const { email, password } = await request.validate(AuthValidator);
			const datas = await auth.use('api').attempt(email, password, { expiresIn: '1 days' });

			return response.ok({ token: datas.token, user: datas.user });
		} catch (error) {
			let message: string;
			switch (error.code) {
				case 'E_INVALID_AUTH_UID':
					message = 'Email not found';
					break;
				case 'E_INVALID_AUTH_PASSWORD':
					message = 'Password is incorrect';
					break;
				default:
					message = 'Unable to login';
			}
			return response.unauthorized({ message: message, error: error });
		}
	}

	public async logout({ auth, response }: HttpContextContract) {
		try {
			await auth.use('api').revoke();

			return response.ok({ revoked: true });
		} catch (error) {
			return response.badRequest({ message: error.messages, error: error });
		}
	}
}
