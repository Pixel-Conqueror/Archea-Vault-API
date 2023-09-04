import { Inertia } from '@inertiajs/inertia';

// @ts-ignore
import VaultImg from 'Assets/images/vault.webp';
import { FormField } from 'Types/Form';

import BasicForm from 'Components/Form/BasicForm';
import BaseLayout from 'Components/Layouts/BaseLayout';

import { Link } from '@inertiajs/inertia-react';
import styles from 'Styles/auth.module.scss';

interface LoginFormValue {
	email: string;
	password: string;
	[key: string]: string;
}

export default function LoginPage() {
	const fields: Array<FormField> = [
		{
			name: 'email',
			label: 'Email',
			type: 'email',
			placeholder: 'Your email address',
		},
		{
			name: 'password',
			label: 'Password',
			type: 'password',
			placeholder: 'Your password',
		},
	];

	const handleSubmit = async (loginFormValue: LoginFormValue) => {
		try {
			const data = await Inertia.post('/login', loginFormValue);
			console.log(data);
		} catch (error) {
			alert(error?.error || 'Something went wrong');
		}
	};

	return (
		<BaseLayout className={styles['auth-page']} childrenClassName={styles['auth-form-wrapper']}>
			<img src={VaultImg} alt="Vault side-image" className={styles['side-image']} />
			<BasicForm
				title="Login"
				fields={fields}
				submitText="Sign in"
				onSubmit={handleSubmit}
				postFormComponent={<PostLoginFormText />}
			/>
		</BaseLayout>
	);
}

function PostLoginFormText() {
	return (
		<>
			Don't have an account yet? <Link href="/register">Register now</Link>
		</>
	);
}
