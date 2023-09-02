import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import AuthValidator from 'App/Validators/AuthValidator';
import RegisterValidator from 'App/Validators/RegisterValidator';

export default class AuthController {
	public async register({ request, inertia }: HttpContextContract) {
		const data = await request.validate(RegisterValidator);
		await User.create(data);
		inertia.location('/login');
	}

	public async login({ request, inertia, auth }: HttpContextContract) {
		const { email, password } = await request.validate(AuthValidator);
		const user = await auth.use('web').attempt(email, password);
		await auth.use('web').login(user);
		inertia.location('/');
	}

	public async logout({ auth, inertia }: HttpContextContract) {
		await auth.use('web').logout();
		inertia.location('/');
	}
}
