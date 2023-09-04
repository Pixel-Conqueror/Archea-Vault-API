import Env from '@ioc:Adonis/Core/Env';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Stripe from '@ioc:Mezielabs/Stripe';
import User from 'App/Models/User';

const STORAGE_PRICE = 2000; // 2k cents -> 20€
const MAX_STORAGE_IN_BYTES = 1024 * 1024 * 1024 * 20;

export default class BillingsController {
	public async checkout({ response, auth }: HttpContextContract) {
		const { url } = await Stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			mode: 'payment',
			line_items: [
				{
					price_data: {
						currency: 'eur',
						product_data: {
							name: '20 GB storage space',
						},
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
		return response.redirect(url!);
	}

	public async hook({ request }: HttpContextContract) {
		const event = createStripeEvent(request);
		if (!event) return;

		const body = request.body();
		const customerEmail = body?.data?.object?.customer_email;

		const { storageCapacity } = await User.findByOrFail('email', customerEmail);

		await User.updateOrCreate(
			{
				email: customerEmail,
			},
			{
				storageCapacity: Number(storageCapacity) + MAX_STORAGE_IN_BYTES,
			}
		);
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
