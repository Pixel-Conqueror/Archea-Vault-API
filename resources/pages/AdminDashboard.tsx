import { HealthReport } from '@ioc:Adonis/Core/HealthCheck';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import User from 'App/Models/User';
import BasicTable from 'Components/BasicTable';
import BasicTabs from 'Components/BasicTabs/BasicTabs';
import LargeLayout from 'Components/Layouts/LargeLayout';
import { InertiaPage } from 'Types/inertia';
import { AiOutlineEye } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';

import styles from 'Styles/admin.module.scss';
import { calculSize } from 'Utils/index';

const usersColumnHelper = createColumnHelper<any>();

interface AdminDashboardProps {
	users: Array<User>;
	healthy: HealthReport;
	stats: {
		totalUsers: number;
		newClientsToday: number;
		totalFiles: number;
		averageFilesPerUser: number;
		filesUploadedToday: number;
		totalSizeInBytes: number;
		totalSize: number;
		averageSizePerUserInBytes: number;
		averageSizePerUser: number;
	};
}
export default function AdminDashboard({
	users,
	stats,
	healthy,
}: InertiaPage['props'] & AdminDashboardProps) {
	const usersTable = useReactTable({
		data: users,
		columns: [
			usersColumnHelper.accessor('id', {
				header: () => '#',
			}),
			usersColumnHelper.accessor('fullName', {
				header: () => 'Fullname',
			}),
			usersColumnHelper.accessor('email', {
				header: () => 'Email',
			}),
			usersColumnHelper.accessor('role', {
				header: () => 'Role',
				cell: (props) => (props.getValue() === 1 ? 'admin' : 'customer'),
			}),
			usersColumnHelper.accessor('id', {
				header: () => 'Actions',
				cell: () => (
					<>
						<AiOutlineEye />
						<BsTrash />
					</>
				),
			}),
		],
		getCoreRowModel: getCoreRowModel(),
	});
	return (
		<LargeLayout
			showSpaceStorage={false}
			childrenStyle={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
		>
			<h1 style={{ marginBottom: '1em' }}>Dashboard Admin</h1>
			<BasicTabs tabNames={['Stats', 'Users']} style={{ gap: '1em' }}>
				<AdminStats stats={stats} healthy={healthy} />
				<BasicTable table={usersTable} />
			</BasicTabs>
		</LargeLayout>
	);
}

function AdminStats({ stats, healthy }: Omit<AdminDashboardProps, 'users'>) {
	const {
		averageFilesPerUser,
		averageSizePerUserInBytes,
		filesUploadedToday,
		newClientsToday,
		totalFiles,
		totalSizeInBytes,
		totalUsers,
	} = stats;

	return (
		<div className={styles['stats-panel']}>
			<ul className={styles['stats-list']}>
				<StatsItem label={`${totalUsers}\r\nclients`} legend="total" />
				<StatsItem label={`${newClientsToday} new\r\nclients`} legend="today" />
				<StatsItem label={`${totalFiles} files\r\nuploaded`} legend="total" />
				<StatsItem label={`${averageFilesPerUser} files / client`} />
				<StatsItem label={`${filesUploadedToday} files\r\nuploaded`} legend="today" />
				<StatsItem label={`${calculSize(totalSizeInBytes)} total\r\nstorage`} legend="total" />
				<StatsItem label={`${calculSize(averageSizePerUserInBytes)} used / client`} />
			</ul>
			<ServicesHealthCheck healthy={healthy} />
		</div>
	);
}

function ServicesHealthCheck({ healthy }: { healthy: HealthReport }) {
	return (
		<div className={styles['health-check']}>
			<h2>Services status</h2>
			<ul className={styles['services']}>
				{Object.entries(healthy.report).map(([_, { displayName, health }]) => {
					const serviceColor = !health.healthy ? 'red' : 'green';
					return (
						<li key={displayName} className={styles['service-status']}>
							<div className={styles['service-name']}>
								<div className={styles['indicator']} style={{ backgroundColor: serviceColor }} />{' '}
								{displayName}
							</div>
							{!health.healthy && <div className={'status-message'}>{health.message}</div>}
						</li>
					);
				})}
			</ul>
		</div>
	);
}

function StatsItem({ label, legend }: { label: string; legend?: string }) {
	return (
		<li className={styles['stats-item']}>
			<div style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>
				{label} {legend && <span className={styles['legend']}>({legend})</span>}
			</div>
		</li>
	);
}
