import Drive from '@ioc:Adonis/Core/Drive';
import Env from '@ioc:Adonis/Core/Env';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Logger from '@ioc:Adonis/Core/Logger';
import StripeController from '@ioc:Archea/StripeController';
import UserController from '@ioc:Archea/UserController';
import Stripe from '@ioc:Mezielabs/Stripe';
import User from 'App/Models/User';
import FileConfig from 'Config/filepath';
import BillingInterface from 'Contracts/interfaces/Billing.interface';

export default class BillingController implements BillingInterface {
	private userController: typeof UserController;
	private stripeController: typeof StripeController;

	constructor() {
		this.init();
	}

	protected async init() {
		this.userController = await UserController;
		this.stripeController = await StripeController;
	}
	public async checkout(ctx: HttpContextContract) {
		const { url } = await this.stripeController.createCheckoutSession(ctx);
		ctx.response.redirect(url!);
	}

	public async stripeHook({ request }: HttpContextContract) {
		const event = createStripeEvent(request);
		if (!event) return;

		const invoiceId = event.data.object['invoice'];
		const customerId = event.data.object['customer'];
		const customer = await this.stripeController.getCustomerById(customerId);

		const user = await this.userController.addStorage(customer.email!);
		Logger.info(`storage purchase validated: ${customer.email}`);

		await this.downloadInvoiceById(invoiceId, user);
		Logger.info(`invoice ${invoiceId} downloaded`);
	}

	public async downloadInvoiceById(invoiceId: string, user: User) {
		const invoice = await this.stripeController.getInvoiceById(invoiceId);

		const request = await fetch(invoice.invoice_pdf!);
		const blob = await request.blob();
		const arrayBuffer = await blob.arrayBuffer();
		const content = Buffer.from(arrayBuffer);

		await Drive.put(`${FileConfig.invoice}/${user.id}/${invoiceId}.pdf`, content);
	}
}

function createStripeEvent(request: HttpContextContract['request']) {
	const stripeSignature = request.header('stripe-signature') || '';
	const rawBody = request.raw() || '';
	const event = Stripe.webhooks.constructEvent(
		rawBody,
		stripeSignature,
		Env.get('STRIPE_WEBHOOK_SECRET')
	);
	return event.type === 'checkout.session.completed' ? event : undefined;
}
