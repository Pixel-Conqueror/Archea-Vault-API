import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BsDot } from 'react-icons/bs';

import BasicTable from 'Components/BasicTable';
import LargeLayout from 'Components/Layouts/LargeLayout';
import SearchBar from 'Components/SearchBar/SearchBar';

import { calculSize } from 'Utils/index';

import styles from 'Styles/cloudspace.module.scss';
console.log(styles);

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
				header: () => 'Nom',
			}),
			usersColumnHelper.accessor('size', {
				header: () => 'Taille',
				cell: (props) => calculSize(props.getValue()),
			}),
			usersColumnHelper.accessor('type', {
				header: () => 'Type',
				cell: (props) => (props.getValue() === 'folder' ? 'Dossier' : props.getValue()),
			}),
			usersColumnHelper.accessor('createdAt', {
				header: () => "Date d'ajout",
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
			</div>
			<h2>Espace de stockage</h2>
			<BasicTable table={filesTable} />
		</LargeLayout>
	);
}
