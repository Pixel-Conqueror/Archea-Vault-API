import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import StripeController from '@ioc:Archea/StripeController';
import User from 'App/Models/User';
import UserInterface from 'Contracts/interfaces/User.interface';
import dayjs from 'dayjs';
import ConvertSizes from 'App/Helpers/ConvertSizes';
import Mail from '@ioc:Adonis/Addons/Mail';
import Env from '@ioc:Adonis/Core/Env';

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

	public async deleteUserDatas({ auth, response, inertia }: HttpContextContract) {
		const userId = auth.user?.id;
		const user = await User.findOrFail(userId);
		if (!user) {
			return response.badRequest('User not found');
		}

		const userFiles = await Database.from('files').where('user_id', user.id).count('* as total');

		await user.delete();

		await Mail.send((message) => {
			message
				.from(`${Env.get('MAIL_FROM')}`)
				.to(user.email)
				.subject('Account Deleted !')
				.htmlView('emails/delete_user', {
					fullName: user.fullName,
				});
		});

		await Mail.send((message) => {
			message
				.from(`${Env.get('MAIL_FROM')}`)
				.to(`${Env.get('MAIL_FROM')}`)
				.subject('An user has left us !')
				.htmlView('emails/deleted_user', {
					fullName: user.fullName,
					email: user.email,
					filesCount: userFiles[0].total,
				});
		});

		inertia.render('/login', { success: 'Your account has been deleted' });
	}

	protected async getUsersCount() {
		const users = await Database.from('users').count('* as total');
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
