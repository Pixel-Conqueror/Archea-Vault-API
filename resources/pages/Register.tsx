// @ts-ignore
import VaultImg from 'Assets/images/vault.webp';

import BasicForm from 'Components/Form/BasicForm';
import BaseLayout from 'Components/Layouts/BaseLayout';

import { FormField } from 'Types/Form';

import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/inertia-react';
import styles from 'Styles/auth.module.scss';

interface RegisterFormValue {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	[key: string]: string;
}

export default function RegisterPage() {
	const fields: Array<FormField> = [
		{ name: 'first_name', label: 'First name', type: 'text', placeholder: 'Your first name' },
		{ name: 'last_name', label: 'Last name', type: 'text', placeholder: 'Your last name' },
		{ name: 'email', label: 'Email', type: 'email', placeholder: 'Your email address' },
		{
			name: 'password',
			type: 'password',
			label: 'Password',
			placeholder: 'Your password',
		},
		{
			name: 'confirm_password',
			type: 'password',
			label: 'Confirm your password',
			placeholder: 'Confirm your password',
		},
	];

	const handleSubmit = async (registerFormValue: RegisterFormValue) => {
		try {
			const data = await Inertia.post('/register', registerFormValue);
			console.log(data);
		} catch (error) {
			alert(error?.error || 'Something went wrong');
		}
	};

	return (
		<BaseLayout className={styles['auth-page']} childrenClassName={styles['auth-form-wrapper']}>
			<img src={VaultImg} alt="Vault side-image" className={styles['side-image']} />
			<BasicForm
				title="Register"
				fields={fields}
				submitText="Register"
				onSubmit={handleSubmit}
				postFormComponent={<PostRegisterFormText />}
			/>
		</BaseLayout>
	);
}

function PostRegisterFormText() {
	return (
		<>
			Already have an account? <Link href="/login">Login</Link>
		</>
	);
}
