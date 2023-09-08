import { CSSProperties, ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';

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
			style={{
				...style,
				width: '100%',
				height: '100%',
			}}
		>
			<Navbar />
			<main className={childrenClassName}>{children}</main>
			<ToastContainer />
		</div>
	);
}
