// @ts-ignore
import VaultImg from 'Assets/images/vault.webp';

import AuthForm from 'Components/Auth/AuthForm';
import BaseLayout from 'Components/Layouts/BaseLayout';

import { FormAuthField } from 'Types/AuthForm';

import styles from 'Styles/auth.module.scss';
import { Inertia } from '@inertiajs/inertia';

export default function LoginPage(...args) {
	console.log(args);
	const fields: Array<FormAuthField> = [
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

	const handleSubmit = async (fields: { id: string; value: string }[]) => {
		const areFieldsOk = fields.reduce((acc, cur) => {
			if (cur.value.trim().length === 0) {
				acc = false;
			}
			return acc;
		}, true);

		if (!areFieldsOk) {
			return alert('Please fill all inputs');
		}

		const email = fields.find(({ id }) => id === 'email')?.value || '';
		const password = fields.find(({ id }) => id === 'password')?.value || '';

		try {
			const data = await Inertia.post('/login', {
				email,
				password,
			});
			console.log(data);
		} catch (error) {
			alert(error?.error || 'Something went wrong');
		}
	};

	// TODO: remove layout and put background image
	// and move vault image to AuthForm component
	return (
		<BaseLayout className={styles['auth-page']} childrenClassName={styles['auth-form-wrapper']}>
			<img src={VaultImg} alt="Vault side-image" className={styles['side-image']} />
			<AuthForm type="login" fields={fields} onSubmit={handleSubmit} />
		</BaseLayout>
	);
}
