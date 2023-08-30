// @ts-ignore
import VaultImg from 'Assets/images/vault.webp';

import AuthForm from 'Components/Auth/AuthForm';
import BaseLayout from 'Components/Layouts/BaseLayout';

import { FormAuthField } from 'Types/AuthForm';
import { makeRequest } from 'Utils/request';

import styles from 'Styles/auth.module.scss';

export default function LoginPage() {
	const fields: Array<FormAuthField> = [
		{
			name: 'email',
			label: 'Email',
			type: 'email',
			placeholder: 'Votre adresse email',
		},
		{
			name: 'password',
			label: 'Mot de passe',
			type: 'password',
			placeholder: 'Votre mot de passe',
		},
	];

	// TODO: ajouter vérification type input via zod ou yup
	const handleLogin = async (fields: { id: string; value: string }[]) => {
		const areFieldsOk = fields.reduce((acc, cur) => {
			if (cur.value.trim().length === 0) {
				acc = false;
			}
			return acc;
		}, true);

		if (!areFieldsOk) {
			return alert('Please fill all inputs');
		}

		const email = fields.find(({ id }) => id === 'email')?.value;
		const password = fields.find(({ id }) => id === 'password')?.value;

		try {
			const data = await makeRequest({
				url: '/login',
				body: { email, password },
			});
			console.log(data);
		} catch (error) {
			alert(error?.error || 'Une erreur est survenue');
		}
	};

	return (
		<BaseLayout className={styles['auth-page']} childrenClassName={styles['auth-form-wrapper']}>
			<img src={VaultImg} alt="Vault side-image" className={styles['side-image']} />
			<AuthForm type="login" fields={fields} onSubmit={handleLogin} />
		</BaseLayout>
	);
}
