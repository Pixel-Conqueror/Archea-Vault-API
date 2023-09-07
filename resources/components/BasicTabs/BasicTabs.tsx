import { CSSProperties, Children, ReactNode } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import styles from './basictabs.module.scss';

export default function BasicTabs({
	children,
	tabNames,
	style = {},
}: {
	children: ReactNode;
	tabNames: Array<string>;
	style?: CSSProperties;
}) {
	return (
		<Tabs className={styles['tabs']} style={style}>
			<TabList className={styles['tab-list']}>
				{tabNames.map((name) => (
					<Tab
						key={name}
						className={styles['tab']}
						selectedClassName={styles['tab-selected']}
						disabledClassName={styles['tab-disabled']}
					>
						{name}
					</Tab>
				))}
			</TabList>
			{Children.map(children, (child) => (
				<TabPanel className={styles['tab-panel']} selectedClassName={styles['tab-panel-selected']}>
					{child}
				</TabPanel>
			))}
		</Tabs>
	);
}
