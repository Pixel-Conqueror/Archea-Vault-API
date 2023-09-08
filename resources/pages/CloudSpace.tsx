import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { BsFillGearFill, BsThreeDots } from 'react-icons/bs';

import BasicTable from 'Components/BasicTable';
import CreateFolder from 'Components/CreateFolder/CreateFolder';
import LargeLayout from 'Components/Layouts/LargeLayout';
import SearchBar from 'Components/SearchBar/SearchBar';
import UploadFiles from 'Components/UploadFiles/UploadFiles';
import UserHeader from 'Components/UserHeader/UserHeader';

import styles from 'Styles/cloudspace.module.scss';
import { calculSize, printDate } from 'Utils/index';
import Folder from 'App/Models/Folder';

interface TableItem {
	id: string;
	name: string;
	type: 'file' | 'folder';
	size?: number;
	createdAt: string;
}

const usersColumnHelper = createColumnHelper<TableItem>();

export default function CloudSpace({ folder }: { folder: Folder }) {
	const [currentFolder, setFolder] = useState<Folder>(folder);
	const [folderIds, setFolderIds] = useState<Array<string>>([currentFolder.id]);
	console.log(folderIds, currentFolder);
	const addFolderId = (folderId: string) => {
		const folder = (currentFolder as any).children.find((f) => f.id === folderId);
		if (folder) {
			setFolderIds((folders) => [...folders, folderId]);
			setFolder(folder);
		}
	};

	// TODO: faire en sorte de récupérer le dossier à afficher (probablement fonction récursive)
	const goPreviousFolder = () =>
		setFolderIds((folders) => {
			const copyFolders = [...folders];
			copyFolders.splice(-1);
			return copyFolders;
		});

	return (
		<LargeLayout>
			<div className={styles['header']}>
				<SearchBar />
				<UserHeader />
			</div>
			<div className={styles['vue-manager']}>
				<h2>Storage space</h2>
				<div className={styles['options']}>
					<CreateFolder parentFolderId={currentFolder.id} />
					<UploadFiles />
				</div>
			</div>
			<p>
				{folderIds.length === 1 ? (
					'/'
				) : (
					<>
						<span onClick={goPreviousFolder}>Back</span> /{folderIds.join(' / ')}
					</>
				)}
			</p>
			<ShowItems
				folders={(currentFolder as any).children}
				files={currentFolder.files}
				addFolderId={addFolderId}
			/>
		</LargeLayout>
	);
}

function ShowItems({
	folders,
	files,
	addFolderId,
}: {
	folders: any;
	files: any;
	addFolderId: (folderId: string) => void;
}) {
	const items = useMemo<Array<TableItem>>(() => createTableItems(folders, files), [folders, files]);
	const handleRowDoubleClick = (row) => {
		if (row.original.type !== 'folder') return;
		addFolderId(row.original.id);
	};
	const filesTable = useReactTable({
		data: items,
		columns: [
			usersColumnHelper.accessor('name', {
				header: () => 'Name',
			}),
			usersColumnHelper.accessor('type', {
				header: () => 'Type',
				cell: (props) => (props.getValue() === 'folder' ? 'Folder' : 'File'),
			}),
			usersColumnHelper.accessor('size', {
				header: () => 'Size',
				cell: (props) => (props.getValue() ? calculSize(props.getValue()) : null),
			}),
			usersColumnHelper.accessor('createdAt', {
				header: () => 'Creation Date',
				cell: (props) => printDate(props.getValue()),
			}),
			usersColumnHelper.accessor('name', {
				header: () => <BsFillGearFill />,
				cell: () => <BsThreeDots />,
			}),
		],
		getCoreRowModel: getCoreRowModel(),
	});
	return <BasicTable table={filesTable} handleRowDoubleClick={handleRowDoubleClick} />;
}

function createTableItems(folders, files) {
	return [
		folders.map(({ id, name, type, size = 0, createdAt }) => ({
			id,
			name,
			type,
			size,
			createdAt,
		})),
		files,
	].flat(1);
}
