import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import StripeController from '@ioc:Archea/StripeController';
import User from 'App/Models/User';
import UserInterface from 'Contracts/interfaces/User.interface';
import dayjs from 'dayjs';
import ConvertSizes from 'App/Helpers/ConvertSizes';

const MAX_STORAGE_IN_BYTES = 1024 * 1024 * 1024 * 20;

export default class UserController implements UserInterface {
	private stripeController: typeof StripeController;
	private ConvertSizes;

	constructor() {
		this.init();
	}

	protected async init() {
		this.stripeController = await StripeController;
		this.ConvertSizes = await new ConvertSizes();
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

	protected async getUsersCount() {
		const users = await Database.from('users').count('* as total');

		console.log(users[0].total, typeof users[0].total);
		return users[0].total;
	}

	protected async getTotalUsersCreatedToday() {
		const yersterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
		const users = await Database.from('users').where('created_at', '>', yersterday);
		return users.length;
	}

	protected async getTotalStorageCapacity(): Promise<any> {
		const totalStorageCapacityInBytes = await Database.from('users').sum(
			'storage_capacity as totalStorageCapacityInBytes'
		);

		const totalStorageCapacityInGB = this.ConvertSizes.convertBytes(
			totalStorageCapacityInBytes[0].totalStorageCapacityInBytes
		);

		return {
			totalStorageCapacityInBytes: totalStorageCapacityInBytes[0].totalStorageCapacityInBytes,
			totalStorageCapacity: totalStorageCapacityInGB,
		};
	}
}
