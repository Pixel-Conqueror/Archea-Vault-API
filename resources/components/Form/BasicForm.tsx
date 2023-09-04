import { usePage } from '@inertiajs/inertia-react';
import { ChangeEvent, FormEvent, ReactNode } from 'react';

import { FormField } from 'Types/Form';
import { InertiaPage } from 'Types/inertia';

import styles from 'Styles/auth.module.scss';

interface BasicFormProps {
	fields: Array<FormField>;
	title: string;
	submitText?: string;
	onSubmit?: (values: any) => void;
	onInputChange?: (event: ChangeEvent<HTMLInputElement>) => void;
	postFormComponent?: ReactNode;
}
export default function BasicForm({
	fields,
	title,
	submitText = 'Submit',
	onSubmit,
	onInputChange,
	postFormComponent,
}: BasicFormProps) {
	const { errors } = usePage<InertiaPage>().props;

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const entries = Array.from(formData.entries());
		const object = entries.reduce((obj, [key, value]) => Object.assign(obj, { [key]: value }), {});

		const areFieldsOk = entries.reduce((acc, [_, value]) => {
			if ((value as string).trim().length === 0) {
				acc = false;
			}
			return acc;
		}, true);

		if (!areFieldsOk) {
			return alert('Please fill all inputs');
		}

		onSubmit && onSubmit(object);
	};

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) =>
		onInputChange && onInputChange(event);

	return (
		<form className={styles['auth-form']} onSubmit={handleSubmit}>
			<h1>{title}</h1>
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
						<div className="legend" style={{ color: 'red', textAlign: 'left' }}>
							{errors[name]}
						</div>
					)}
				</div>
			))}
			<div className={styles['field']}>
				<button>{submitText}</button>
			</div>
			{postFormComponent && (
				<div className={`${styles['field']} ${styles['inline']}`}>{postFormComponent}</div>
			)}
		</form>
	);
}
