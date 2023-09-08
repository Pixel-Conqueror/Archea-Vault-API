import HealthCheck from '@ioc:Adonis/Core/HealthCheck';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import UserController from '@ioc:Archea/UserController';
import FileController from '@ioc:Archea/FileController';

export default class AdminController {
	private userController;
	private fileController;

	constructor() {
		this.init();
	}

	protected async init() {
		this.userController = await UserController;
		this.fileController = await FileController;
	}

	public async index({ inertia }: HttpContextContract) {
		const users: number = await this.userController.getUsersCount();

		const totalUsers = users;
		const newClients = await this.userController.getTotalUsersCreatedToday();
		const totalUsersStorage = await this.userController.getTotalStorageCapacity();
		const averageStorageTotal = totalUsersStorage / totalUsers;
		const filesStats = await this.fileController.calculateFileStatistics();

		const stats = {
			totalUsers,
			newClients,
			totalUsersStorage,
			averageStorageTotal,
			files: filesStats,
		};

		return inertia.render('AdminDashboard', {
			users,
			healthy: await HealthCheck.getReport(),
			stats,
		});
	}
}
