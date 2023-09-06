/*
|--------------------------------------------------------------------------
| Inertia Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import Inertia from '@ioc:EidelLev/Inertia';

Inertia.share({
	errors: (ctx) => ctx.session.flashMessages.get('errors'),
	auth: async (ctx) => {
		await ctx.auth.check();
		return {
			user: ctx.auth.user,
			isAuthenticated: ctx.auth.isAuthenticated,
		};
	},
}).version(() => Inertia.manifestFile('public/assets/manifest.json'));
