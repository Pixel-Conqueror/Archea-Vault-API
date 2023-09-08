import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Logger from '@ioc:Adonis/Core/Logger';

export default class Admin {
	protected redirectTo = '/';

	public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
		console.log(auth.user, auth.user?.role);
		if (auth.user?.role !== 1) {
			Logger.info(`[${auth.user?.email}] admin rejected`);
			return response.location(this.redirectTo);
		}

		await next();
	}
}
