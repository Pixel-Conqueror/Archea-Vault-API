// @ts-ignore
import VaultImg from 'Assets/images/vault.webp';

import AuthForm from 'Components/Auth/AuthForm';
import BaseLayout from 'Components/Layouts/BaseLayout';

import { FormAuthField } from 'Types/AuthForm';

import { Inertia } from '@inertiajs/inertia';
import styles from 'Styles/auth.module.scss';

// TODO: form validity via yup
export default function RegisterPage(...args) {
	console.log(args);
	const fields: Array<FormAuthField> = [
		{ name: 'first_name', label: 'Prénom', type: 'text', placeholder: 'Votre prénom' },
		{ name: 'last_name', label: 'Nom', type: 'text', placeholder: 'Votre nom de famille' },
		{ name: 'email', label: 'Email', type: 'email', placeholder: 'Votre adresse email' },
		{
			name: 'password',
			type: 'password',
			label: 'Mot de passe',
			placeholder: 'Votre mot de passe',
		},
		{
			name: 'confirm_password',
			type: 'password',
			label: 'Confirmer mot de passe',
			placeholder: 'Confirmer votre mot de passe',
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
		const firstName = fields.find(({ id }) => id === 'first_name')?.value || '';
		const lastName = fields.find(({ id }) => id === 'last_name')?.value || '';

		try {
			const data = await Inertia.post('/register', {
				email,
				password,
				first_name: firstName,
				last_name: lastName,
			});
			console.log(data);
		} catch (error) {
			alert(error?.error || 'Une erreur est survenue');
		}
	};
	const handleInputChange = console.log;

	return (
		<BaseLayout className={styles['auth-page']} childrenClassName={styles['auth-form-wrapper']}>
			<img src={VaultImg} alt="Vault side-image" className={styles['side-image']} />
			<AuthForm
				type="register"
				fields={fields}
				onInputChange={handleInputChange}
				onSubmit={handleSubmit}
			/>
		</BaseLayout>
	);
}
