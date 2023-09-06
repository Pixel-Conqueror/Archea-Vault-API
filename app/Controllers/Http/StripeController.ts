import Env from '@ioc:Adonis/Core/Env';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Logger from '@ioc:Adonis/Core/Logger';
import Stripe from '@ioc:Mezielabs/Stripe';
import User from 'App/Models/User';
import StripeInterface from 'Contracts/interfaces/Stripe.interface';
import StripeClass from 'stripe';

const STORAGE_PRICE = 2000; // 2k cents -> 20€

export default class StripeController implements StripeInterface {
	public async createCheckoutSession({ auth }: HttpContextContract) {
		const customer = await this.findCustomerByEmail(auth.user?.email!);
		Logger.info(
			`[${auth.user?.email}] Stripe customer ${customer ? 'already exist' : 'does not exists yet'}`
		);
		const session = await Stripe.checkout.sessions.create({
			...(customer && { customer: customer.id }),
			...(customer === undefined && { customer_email: auth.user?.email }),
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
			cancel_url: `${Env.get('APP_URL')}/cloud-space`,
			invoice_creation: {
				enabled: true,
			},
		});
		Logger.info(`[${auth.user?.email}] Stripe checkout session created`);
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
		const customer = await this.findCustomerByEmail(user.email);
		if (!customer) return [];

		const invoices = await Stripe.invoices.list({
			customer: customer.id,
		});
		return invoices.data;
	}

	public async findCustomerByEmail(email: string) {
		const customers = await Stripe.customers.search({ query: `email: "${email}"` });
		return customers?.data?.[0] || undefined;
	}

	public async getCustomerByEmail(email: string) {
		const customer = this.findCustomerByEmail(email);
		if (!customer) {
			throw new Error('Unable to find stripe customer with email: ' + email);
		}
		return customer;
	}

	public async findCustomerById(id: string) {
		return (await Stripe.customers.retrieve(id)) as StripeClass.Customer;
	}

	public async getCustomerById(id: string) {
		const customer = this.findCustomerById(id);
		if (!customer) {
			throw new Error('Unable to find stripe customer with id: ' + id);
		}
		return customer;
	}
}
