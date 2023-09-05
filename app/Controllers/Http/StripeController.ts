import Env from '@ioc:Adonis/Core/Env';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Logger from '@ioc:Adonis/Core/Logger';
import Stripe from '@ioc:Mezielabs/Stripe';
import User from 'App/Models/User';
import StripeInterface from 'Contracts/interfaces/Stripe.interface';

const STORAGE_PRICE = 2000; // 2k cents -> 20€

export default class StripeController implements StripeInterface {
	public async createCheckoutSession({ auth }: HttpContextContract) {
		const session = await Stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			mode: 'payment',
			billing_address_collection: 'required',
			automatic_tax: {
				enabled: true,
			},
			line_items: [
				{
					price_data: {
						currency: 'eur',
						product_data: {
							name: '20 GB storage space',
							tax_code: 'txcd_10000000', // we can use a more specific tax code
						},
						tax_behavior: 'inclusive',
						unit_amount: STORAGE_PRICE,
					},
					quantity: 1,
				},
			],
			success_url: `${Env.get('APP_URL')}/cloud-space`,
			cancel_url: Env.get('APP_URL'),
			invoice_creation: {
				enabled: true,
			},
			customer_email: auth.user?.email,
		});
		Logger.info(`stripe checkout session created: ${auth.user?.email}`);
		return session;
	}

	public async getInvoiceById(invoiceId: string) {
		const invoice = await Stripe.invoices.retrieve(invoiceId);
		if (!invoice?.invoice_pdf) {
			throw new Error('Invoice PDF URL undefined');
		}
		return invoice;
	}

	public async getUserInvoices(user: User) {
		const customer = await this.getCustomerByEmail(user.email);
		const invoices = await Stripe.invoices.list({
			customer: customer.id,
		});
		console.log('invoices', invoices);
		return invoices.data;
	}

	public async getCustomerByEmail(email: string) {
		const customer = (await Stripe.customers.search({ query: `email: "${email}"`, limit: 1 }))
			?.data?.[0];
		if (!customer) {
			throw new Error('Unable to retrieve user with email: ' + email);
		}
		return customer;
	}
}
