import { Link, usePage } from '@inertiajs/inertia-react';
import { ChangeEvent, FormEvent } from 'react';

import { FormAuthField } from 'Types/AuthForm';

import styles from 'Styles/auth.module.scss';
import { InertiaPage } from 'Types/inertia';

interface AuthFormProps {
	fields: Array<FormAuthField>;
	type: 'login' | 'register';
	onSubmit?: (values: any) => void;
	onInputChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}
export default function AuthForm({ fields, type, onSubmit, onInputChange }: AuthFormProps) {
	const { errors } = usePage<InertiaPage>().props;

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const entries = Array.from(formData.entries());

		const values = entries.map(([key, value]) => ({
			id: key,
			value,
		}));

		onSubmit && onSubmit(values);
	};

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) =>
		onInputChange && onInputChange(event);

	return (
		<form className={styles['auth-form']} onSubmit={handleSubmit}>
			<h1>{type === 'login' ? 'Connexion' : 'Inscription'}</h1>
			{fields.map(({ name, label, type, placeholder }) => (
				<div
					className={styles['field']}
					// initial={{ x: -30, opacity: 0 }}
					// animate={{ x: 0, opacity: 1 }}
					// transition={{
					// 	delay: index * 0.1,
					// }}
					key={name}
				>
					<label htmlFor={name}>{label}</label>
					<input
						type={type}
						onChange={handleInputChange}
						placeholder={placeholder}
						name={name}
						id={name}
					/>
					{errors?.[name] && (
						<div className="legend" style={{ color: 'red' }}>
							{errors[name]}
						</div>
					)}
				</div>
			))}
			<div className={styles['field']}>
				<button>{type === 'login' ? 'Se connecter' : "S'inscrire"}</button>
			</div>
			<div className={`${styles['field']} ${styles['inline']}`}>
				{type === 'login' ? (
					<>
						Pas encore de compte ? <Link href="/register">Inscrivez-vous</Link>
					</>
				) : (
					<>
						Déjà inscrit ? <Link href="/login">Connectez-vous</Link>
					</>
				)}
			</div>
			<div className={styles['divider']}>
				<span>Ou</span>
			</div>
			<button>Continuer avec Google</button>
		</form>
	);
}
