import { Link } from '@inertiajs/inertia-react';

export default function Navbar() {
	return (
		<nav>
			<ul>
				<li>
					<Link href="/">Archea Vault</Link>
				</li>
				<li>
					<Link href="/cloud-space">Mon cloud</Link>
				</li>
			</ul>
			<ul>
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
