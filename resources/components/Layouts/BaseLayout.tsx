import { CSSProperties, ReactNode } from 'react';

import Navbar from 'Components/Navbar/Navbar';

export default function BaseLayout({
	className,
	childrenClassName,
	children,
	style = {},
}: {
	className?: string;
	childrenClassName?: string;
	children: ReactNode;
	style?: CSSProperties;
}) {
	return (
		<div
			className={className}
			// initial={{ opacity: 0, scale: 0.95 }}
			// animate={{ opacity: 1, scale: 1 }}
			// transition={{
			// 	type: 'spring',
			// 	stiffness: 260,
			// 	damping: 20,
			// }}
			style={style}
		>
			<Navbar />
			<main className={childrenClassName}>{children}</main>
		</div>
	);
}
