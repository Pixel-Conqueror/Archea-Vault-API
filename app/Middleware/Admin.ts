import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class Admin {
	protected redirectTo = '/';

	public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
		if (auth.user?.role !== 1) {
			return response.location(this.redirectTo);
		}

		await next();
	}
}
