import { useEffect, useState } from 'react';

export default function Home() {
	const [count, setCount] = useState<number>(0);
	const handleClick = () => setCount((c) => (c += 1));
	useEffect(() => {
		console.log('effect');
	}, []);

	return (
		<div>
			<button onClick={handleClick}>click {count}</button>
		</div>
	);
}
