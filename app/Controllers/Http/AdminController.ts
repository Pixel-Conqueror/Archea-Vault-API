import HealthCheck from '@ioc:Adonis/Core/HealthCheck';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import FileController from '@ioc:Archea/FileController';
import UserController from '@ioc:Archea/UserController';

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
		const users: number = await this.userController.getUsers();
		const usersCount: number = await this.userController.getUsersCount();

		const newClientsToday = await this.userController.getTotalUsersCreatedToday();
		const filesStats = await this.fileController.calculateFileStatistics();

		const stats = {
			users,
			totalUsers: usersCount,
			newClientsToday,
			...filesStats,
		};

		return inertia.render('AdminDashboard', {
			users,
			healthy: await HealthCheck.getReport(),
			stats,
		});
	}
}
