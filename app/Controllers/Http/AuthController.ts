import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import AuthValidator from 'App/Validators/AuthValidator';
import RegisterValidator from 'App/Validators/RegisterValidator';
import Env from '@ioc:Adonis/Core/Env';
import Mail from '@ioc:Adonis/Addons/Mail';

export default class AuthController {
	public async register({ request, inertia }: HttpContextContract) {
		const data = await request.validate(RegisterValidator);
		const user = await User.create(data);

		await Mail.send((message) => {
			message
				.from(`${Env.get('MAIL_FROM')}`)
				.to(user.email)
				.subject('Welcome To Archéa Vault !')
				.htmlView('emails/welcome', {
					fullName: user.fullName,
					url: `${Env.get('APP_URL')}/verify_email/${user.id}`,
				});
		});

		inertia.location('/login');
	}

	public async verifyEmail({ inertia, params }: HttpContextContract) {
		const user = await User.findOrFail(params.userId);
		user.isEmailVerified = true;
		await user.save();
		inertia.render('/login', { success: 'Your email has been verified' });
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
