import type { ApplicationContract } from '@ioc:Adonis/Core/Application';

export default class AppProvider {
	constructor(protected app: ApplicationContract) {}

	public register() {
		// Register your own bindings
		this.app.container.singleton('Archea/UserController', async () => {
			const UserController = (await import('../app/Controllers/Http/UserController')).default;
			return new UserController();
		});
		this.app.container.singleton('Archea/BillingController', async () => {
			const BillingController = (await import('../app/Controllers/Http/BillingController')).default;
			return new BillingController();
		});
		this.app.container.singleton('Archea/StripeController', async () => {
			const StripesController = (await import('../app/Controllers/Http/StripeController')).default;
			return new StripesController();
		});
		this.app.container.singleton('Archea/FileController', async () => {
			const FileController = (await import('../app/Controllers/Http/FileController')).default;
			return new FileController();
		});
	}

	public async boot() {
		// IoC container is ready
	}

	public async ready() {
		// App is ready
	}

	public async shutdown() {
		// Cleanup, since app is going down
	}
}
