// @ts-ignore
import VaultImg from 'Assets/images/vault.webp';

import AuthForm from 'Components/Auth/AuthForm';
import BaseLayout from 'Components/Layouts/BaseLayout';

import { FormAuthField } from 'Types/AuthForm';

import styles from 'Styles/auth.module.scss';

// TODO: form validity via yup
export default function RegisterPage() {
	const fields: Array<FormAuthField> = [
		{ name: 'firstname', label: 'Prénom', type: 'text', placeholder: 'Votre prénom' },
		{ name: 'lastname', label: 'Nom', type: 'text', placeholder: 'Votre nom de famille' },
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

	const handleSubmit = console.log;
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
