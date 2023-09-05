import { Children, ReactNode } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import styles from './basictabs.module.scss';

export default function BasicTabs({
	children,
	tabNames,
}: {
	children: ReactNode;
	tabNames: Array<string>;
}) {
	return (
		<Tabs className={styles['tabs']}>
			<TabList className={styles['tab-list']}>
				{tabNames.map((name) => (
					<Tab
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
