import { CSSProperties, ReactNode } from 'react';

import SideBar from 'Components/SideBar/SideBar';
import styles from './layout.module.scss';

export default function LargeLayout({
	className = styles['layout'],
	childrenClassName = styles['layout-content'],
	children,
	style = {},
	childrenStyle = {},
	showSpaceStorage = true,
}: {
	className?: string;
	childrenClassName?: string;
	children: ReactNode;
	style?: CSSProperties;
	childrenStyle?: CSSProperties;
	showSpaceStorage?: boolean;
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
			<SideBar showSpaceStorage={showSpaceStorage} />
			<main className={childrenClassName} style={childrenStyle}>
				{children}
			</main>
		</div>
	);
}
