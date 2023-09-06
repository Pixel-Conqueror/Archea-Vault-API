import { Stripe } from 'stripe';

import BasicTabs from 'Components/BasicTabs/BasicTabs';
import BasicForm from 'Components/Form/BasicForm';
import Invoices from 'Components/Invoices';
import BaseLayout from 'Components/Layouts/BaseLayout';

import { FormField } from 'Types/Form';
import { InertiaPage } from 'Types/inertia';
import { printDate } from 'Utils/index';

import styles from 'Styles/profile.module.scss';

export default function Profile({
	auth: { user },
	invoices,
}: InertiaPage['props'] & { invoices: Array<Stripe.Invoice> }) {
	const fields: Array<FormField> = [
		{ name: 'first_name', label: 'First name', defaultValue: user!.firstName },
		{ name: 'last_name', label: 'Last name', defaultValue: user!.lastName },
		{ name: 'email', label: 'Email', type: 'email', defaultValue: user!.email },
		{
			name: 'created_at',
			label: 'Creation date',
			type: 'text',
			defaultValue: printDate(user!.createdAt.valueOf()),
		},
		{
			name: 'updated_at',
			label: 'Update date',
			type: 'text',
			defaultValue: printDate(user!.updatedAt.valueOf()),
		},
		{
			name: 'status',
			label: 'Status',
			type: 'text',
			defaultValue: user!.role === 1 ? 'Admin' : 'Client',
		},
	];

	return (
		<BaseLayout childrenClassName={styles['profile']}>
			<BasicTabs tabNames={['Profile', 'Invoices']}>
				<>
					<BasicForm title={user!.fullName} fields={fields} />
					<button style={{ backgroundColor: 'red' }}>delete account (todo)</button>
				</>
				{invoices.length === 0 ? <p>No invoice yet</p> : <Invoices invoices={invoices} />}
			</BasicTabs>
		</BaseLayout>
	);
}
