import { Link, usePage } from '@inertiajs/inertia-react';

import BaseLayout from 'Components/Layouts/BaseLayout';
import { InertiaPage } from 'Types/inertia';

import styles from 'Styles/home.module.scss';

export default function HomePage() {
	const { auth } = usePage<InertiaPage>().props;
	return (
		<BaseLayout>
			<header className={styles['header']}>
				<h1>Archea Vault</h1>
				<p>
					Welcome on Archea Vault, your favorite architect's website
					<br />
					Site created by the fictive company Pixel Conquerors
				</p>
				{!auth.isAuthenticated && (
					<div className={styles['actions']}>
						<Link href="/login">Login</Link>
						<Link href="/register">Register</Link>
					</div>
				)}
				{auth.isAuthenticated && (
					<div className={styles['actions']}>
						<Link href="/">Cloud space</Link>
						<Link href="/">Buy storage</Link>
					</div>
				)}
			</header>
		</BaseLayout>
	);
}
