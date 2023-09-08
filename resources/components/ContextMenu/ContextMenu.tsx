import { Item, ItemParams, Menu, Separator } from 'react-contexify';
import { AiOutlineCloudDownload, AiOutlineInfoCircle } from 'react-icons/ai';
import { BiEditAlt } from 'react-icons/bi';
import { BsTrash } from 'react-icons/bs';

export default function ContextMenu({
	menuId,
	onItemClick,
}: {
	menuId: string;
	onItemClick: (args: ItemParams) => void;
}) {
	return (
		<Menu id={menuId}>
			<Item onClick={onItemClick}>
				<AiOutlineCloudDownload /> Download
			</Item>
			<Item onClick={onItemClick}>
				<AiOutlineInfoCircle /> Informations
			</Item>
			<Item onClick={onItemClick}>
				<BiEditAlt /> Rename
			</Item>
			<Separator />
			<Item onClick={onItemClick}>
				<BsTrash /> Remove
			</Item>
		</Menu>
	);
}
