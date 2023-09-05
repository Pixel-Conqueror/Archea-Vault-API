import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default interface BillingInterface {
	checkout(ctx: HttpContextContract): void;
	stripeHook(ctx: HttpContextContract): void;
}
