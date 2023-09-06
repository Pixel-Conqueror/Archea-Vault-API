import HealthCheck from '@ioc:Adonis/Core/HealthCheck';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import UserController from '@ioc:Archea/UserController';

export default class AdminController {
	private userController: typeof UserController;

	constructor() {
		this.init();
	}

	protected async init() {
		this.userController = await UserController;
	}

	public async index({ inertia }: HttpContextContract) {
		const users = await this.userController.getUsers();
		const usersCount = users.length;
		const totalUsersStorage = users.reduce((acc, user) => (acc += user.storageCapacity), 0);
		const averageStorageTotal = (totalUsersStorage / usersCount).toFixed(2);
		const stats = {
			usersCount,
			totalUsersStorage,
			averageStorageTotal,
		};
		return inertia.render('AdminDashboard', {
			users,
			healthy: await HealthCheck.getReport(),
			stats,
		});
	}
}
