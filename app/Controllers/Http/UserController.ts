import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import StripeController from '@ioc:Archea/StripeController';
import User from 'App/Models/User';
import UserInterface from 'Contracts/interfaces/User.interface';
import dayjs from 'dayjs';

const MAX_STORAGE_IN_BYTES = 1024 * 1024 * 1024 * 20;

export default class UserController implements UserInterface {
	private stripeController: typeof StripeController;

	constructor() {
		this.init();
	}

	protected async init() {
		this.stripeController = await StripeController;
	}

	public async profile({ inertia, auth }: HttpContextContract) {
		const userInvoices = await this.stripeController.getUserInvoices(auth.user!);
		return inertia.render('Profile', { invoices: userInvoices });
	}

	public async addStorage(email: string, amount: number = MAX_STORAGE_IN_BYTES) {
		const { storageCapacity } = await User.findByOrFail('email', email);
		return await User.updateOrCreate(
			{
				email,
			},
			{
				storageCapacity: Number(storageCapacity) + amount,
			}
		);
	}

	public async getUsers() {
		return await User.all();
	}

	public async getTotalUsersCreatedToday() {
		const yersterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
		const users = await Database.from('users').where('created_at', '>', yersterday);
		return users.length;
	}
}
