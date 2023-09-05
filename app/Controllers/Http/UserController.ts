import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import StripeController from '@ioc:Archea/StripeController';
import User from 'App/Models/User';
import UserInterface from 'Contracts/interfaces/User.interface';

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
}
