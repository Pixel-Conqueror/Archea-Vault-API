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
		const users: number = await this.userController.getUsersCount();

		const totalUsers = users;
		const newClients = await this.userController.getTotalUsersCreatedToday();
		const totalUsersStorage = users.reduce((acc, user) => (acc += Number(user.storageCapacity)), 0);
		const averageStorageTotal = totalUsersStorage / totalUsers;

		const stats = {
			totalUsers,
			newClients,
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
