import { CSSProperties, ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';

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
		<div className={className} style={style}>
			<SideBar showSpaceStorage={showSpaceStorage} />
			<main className={childrenClassName} style={childrenStyle}>
				{children}
			</main>
			<ToastContainer />
		</div>
	);
}
