import { useState } from 'react';
import BaseLayout from 'Components/Layouts/BaseLayout';

export default function HomePage() {
	const [count, setCount] = useState(0);
	const handleClick = () => setCount((c) => (c += 1));
	return (
		<BaseLayout>
			<button onClick={handleClick}>a {count}</button>
			<h1>Archea Vault</h1>
			<p>Bienvenue sur Archea Vault, le site de votre architecte préfére !</p>
			<p>Site réalisé par la société fictive Pixel Conquerors</p>
		</BaseLayout>
	);
}
