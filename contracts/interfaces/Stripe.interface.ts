import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import { Stripe } from 'stripe';

export default interface StripeInterface {
	createCheckoutSession(
		ctx: HttpContextContract
	): Promise<Stripe.Response<Stripe.Checkout.Session>>;
	getInvoiceById(invoiceId: string): Promise<Stripe.Invoice>;
	getUserInvoices(user: User): Promise<Stripe.Invoice[]>;
	getCustomerByEmail(email: string): Promise<Stripe.Customer>;
}
