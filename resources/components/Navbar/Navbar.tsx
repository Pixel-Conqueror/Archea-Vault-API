import { Link } from '@inertiajs/inertia-react';
import styles from './navbar.module.scss';

export default function Navbar() {
	return (
		<nav className={styles['navbar']}>
			<ul className={styles['block']}>
				<li>
					<Link href="/">Archea Vault</Link>
				</li>
				<li>
					<Link href="/cloud-space">Mon cloud</Link>
				</li>
			</ul>
			<ul className={styles['block']}>
				<li>
					<Link href="/login">Login</Link>
				</li>
				<li>
					<Link href="/register">Register</Link>
				</li>
			</ul>
		</nav>
	);
}
