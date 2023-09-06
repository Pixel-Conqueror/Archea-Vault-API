import { HealthReport } from '@ioc:Adonis/Core/HealthCheck';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import User from 'App/Models/User';
import BasicTable from 'Components/BasicTable';
import BasicTabs from 'Components/BasicTabs/BasicTabs';
import LargeLayout from 'Components/Layouts/LargeLayout';
import { InertiaPage } from 'Types/inertia';
import { AiOutlineEye } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';

const usersColumnHelper = createColumnHelper<any>();

interface AdminDashboardProps {
	users: Array<User>;
	healthy: HealthReport;
	stats: {
		usersCount: number;
		totalUsersStorage: number;
		averageStorageTotal: number;
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
		<LargeLayout showSpaceStorage={false}>
			<BasicTabs tabNames={['Stats', 'Users', 'Files']}>
				<AdminStats stats={stats} healthy={healthy} />
				<BasicTable table={usersTable} />
				<>Files</>
			</BasicTabs>
		</LargeLayout>
	);
}

function AdminStats({ stats, healthy }: Omit<AdminDashboardProps, 'users'>) {
	console.log(healthy);

	return (
		<div>
			<div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
				<div>{stats.totalUsersStorage} total users storage</div>
				<div>{stats.averageStorageTotal} average storage total</div>
				<div>{stats.usersCount} users count</div>
			</div>
			<div>
				<ul>
					{Object.entries(healthy.report).map(([_, { displayName, health }]) => (
						<li style={{ backgroundColor: !health.healthy ? 'red' : 'green' }}>
							{displayName} {'->'} {!health.healthy ? health.message : ''}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
