import { Link, usePage } from '@inertiajs/inertia-react';
import { InertiaPage } from 'Types/inertia';
import styles from './navbar.module.scss';

export default function Navbar() {
	const { auth } = usePage<InertiaPage>().props;
	return (
		<nav className={styles['navbar']}>
			<ul className={styles['block']}>
				<li>
					<Link href="/">Archea Vault</Link>
				</li>
				{auth.isAuthenticated && (
					<li>
						<Link href="/cloud-space">Cloud space</Link>
					</li>
				)}
			</ul>
			<ul className={styles['block']}>
				{auth.isAuthenticated ? (
					<>
						<li>
							<Link href="/profile">{auth.user?.fullName}</Link>
						</li>
						<li>
							<Link href="/logout">Logout</Link>
						</li>
					</>
				) : (
					<>
						<li>
							<Link href="/login">Login</Link>
						</li>
						<li>
							<Link href="/register">Register</Link>
						</li>
					</>
				)}
			</ul>
		</nav>
	);
}
