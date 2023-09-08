import HealthCheck from '@ioc:Adonis/Core/HealthCheck';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import UserController from '@ioc:Archea/UserController';

export default class AdminController {
	private userController;

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
		const totalUsersStorage = await this.userController.getTotalStorageCapacity();
		const averageStorageTotal = totalUsersStorage / totalUsers;
		//const filesStats = ((await this.fileController) as any).calculateFileStatistics();

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
