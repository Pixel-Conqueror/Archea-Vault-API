import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { ItemParams, useContextMenu } from 'react-contexify';
import { BsFillGearFill, BsThreeDots } from 'react-icons/bs';

import BasicTable from 'Components/BasicTable';
import ContextMenu from 'Components/ContextMenu/ContextMenu';
import CreateFolder from 'Components/CreateFolder/CreateFolder';
import LargeLayout from 'Components/Layouts/LargeLayout';
import SearchBar from 'Components/SearchBar/SearchBar';
import UploadFiles from 'Components/UploadFiles/UploadFiles';
import UserHeader from 'Components/UserHeader/UserHeader';

import Folder from 'App/Models/Folder';
import { calculSize, printDate } from 'Utils/index';

import User from 'App/Models/User';
import styles from 'Styles/cloudspace.module.scss';
import { AiOutlineLink } from 'react-icons/ai';

interface TableItem {
	id: string;
	name: string;
	type: 'file' | 'folder';
	size?: number;
	createdAt: string;
}

const usersColumnHelper = createColumnHelper<TableItem>();
const MENU_ID = 'menu-id';

export default function CloudSpace({
	auth,
	folder,
	totalUserStorage,
}: {
	auth: { user: User };
	folder: Folder;
	totalUserStorage: number;
}) {
	console.log(folder);
	const [currentFolder, setFolder] = useState<Folder>(folder);
	const [folderIds, setFolderIds] = useState<Array<string>>([currentFolder.id]);

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

	if (auth.user.storageCapacity === 0 || totalUserStorage >= auth.user.storageCapacity) {
		return (
			<LargeLayout>
				<a href="/buy-storage" style={{ display: 'flex', gap: '.25em', alignItems: 'center' }}>
					<AiOutlineLink /> Increase your storage capacity
				</a>
			</LargeLayout>
		);
	}
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
					{<UploadFiles />}
				</div>
			</div>
			<BreadCrumb paths={folderIds} onBack={goPreviousFolder} />
			<ShowItems
				folders={(currentFolder as any).children || []}
				files={currentFolder.files || []}
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
				cell: ({ row }) => <MenuDropdown item={row.original} />,
			}),
		],
		getCoreRowModel: getCoreRowModel(),
	});
	return <BasicTable table={filesTable} handleRowDoubleClick={handleRowDoubleClick} />;
}

function createTableItems(folders, files) {
	console.log('folders', folders, 'files', files);
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

function BreadCrumb({ paths = [], onBack }: { paths: string[]; onBack: () => void }) {
	return (
		<p>
			{paths.length === 1 ? (
				'/'
			) : (
				<>
					<span onClick={onBack}>Back</span> /{paths.join(' / ')}
				</>
			)}
		</p>
	);
}

function MenuDropdown({ item }: { item: TableItem }) {
	const { show } = useContextMenu({
		id: MENU_ID,
	});
	const handleSettings = (event) => show({ event });

	const handleItemClick = ({ id, event, props }: ItemParams) => {
		switch (id) {
			case 'copy':
				console.log(event, props);
				break;
			case 'cut':
				console.log(event, props);
				break;
			//etc...
		}
	};

	return (
		<>
			<BsThreeDots onClick={handleSettings} />
			<ContextMenu menuId={item.id} onItemClick={handleItemClick} />
		</>
	);
}
