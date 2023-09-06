import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import {
	AiFillHeart,
	AiOutlineCloudUpload,
	AiOutlineFolderAdd,
	AiOutlineHeart,
} from 'react-icons/ai';
import { BsDot, BsFillGearFill, BsThreeDots } from 'react-icons/bs';

import BasicTable from 'Components/BasicTable';
import LargeLayout from 'Components/Layouts/LargeLayout';
import SearchBar from 'Components/SearchBar/SearchBar';
import UserHeader from 'Components/UserHeader/UserHeader';

import { calculSize } from 'Utils/index';

import styles from 'Styles/cloudspace.module.scss';

interface File {
	name: string;
	favorite: boolean;
	size: number;
	type: 'folder' | 'zip' | 'pdf' | 'other';
	createdAt: string;
}
const usersColumnHelper = createColumnHelper<File>();

const files: Array<File> = [
	{
		favorite: true,
		name: 'Test',
		size: 4861418416,
		type: 'folder',
		createdAt: '21/04/2023 11:57',
	},
	{
		favorite: false,
		name: 'Test File',
		size: 7899641,
		type: 'pdf',
		createdAt: '21/04/2023 11:57',
	},
];

export default function CloudSpace() {
	const filesTable = useReactTable({
		data: files,
		columns: [
			usersColumnHelper.accessor('favorite', {
				header: () => <AiOutlineHeart />,
				cell: (props) => (props.getValue() === true ? <AiFillHeart /> : <BsDot />),
			}),
			usersColumnHelper.accessor('name', {
				header: () => 'Name',
			}),
			usersColumnHelper.accessor('size', {
				header: () => 'Size',
				cell: (props) => calculSize(props.getValue()),
			}),
			usersColumnHelper.accessor('type', {
				header: () => 'Type',
				cell: (props) => (props.getValue() === 'folder' ? 'Dossier' : props.getValue()),
			}),
			usersColumnHelper.accessor('createdAt', {
				header: () => 'Creation Date',
			}),
			usersColumnHelper.accessor('name', {
				header: () => <BsFillGearFill />,
				cell: () => <BsThreeDots />,
			}),
		],
		getCoreRowModel: getCoreRowModel(),
	});
	return (
		<LargeLayout
			className={styles['cloud-space-wrapper']}
			childrenClassName={styles['cloud-space']}
		>
			<div className={styles['header']}>
				<SearchBar />
				<UserHeader />
			</div>
			<div className={styles['vue-manager']}>
				<h2>Storage space</h2>
				<div className={styles['options']}>
					<span>
						<AiOutlineFolderAdd /> Create a folder
					</span>
					<span>
						<AiOutlineCloudUpload /> Upload
					</span>
				</div>
			</div>
			<BasicTable table={filesTable} />
		</LargeLayout>
	);
}
