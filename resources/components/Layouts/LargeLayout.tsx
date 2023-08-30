import { motion } from 'framer-motion';
import { CSSProperties, ReactNode } from 'react';

import CloudSideBar from 'Components/CloudSideBar/CloudSideBar';

export default function LargeLayout({
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
		<motion.div
			className={className}
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{
				type: 'spring',
				stiffness: 260,
				damping: 20,
			}}
			style={style}
		>
			<CloudSideBar />
			<main className={childrenClassName}>{children}</main>
		</motion.div>
	);
}
