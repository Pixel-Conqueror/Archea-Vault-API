/*
 * @mezielabs/adonis-stripe
 *
 * (c) Chimezie Enyinnaya <chimezie@mezielabs.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare module '@ioc:Mezielabs/Stripe' {
	import Stripe from 'stripe';

	const stripe: Stripe;

	export default stripe;
}

declare module '@ioc:Archea/StripeController' {
	import StripeInterface from 'Contracts/interfaces/Stripe.interface';
	const StripeController: StripeInterface;
	export default StripeController;
}
