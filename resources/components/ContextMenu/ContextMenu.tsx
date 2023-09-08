import { Menu, Item, Separator, Submenu, useContextMenu } from 'react-contexify';

const MENU_ID = 'menu-id';

export default function ContextMenu() {
	// 🔥 you can use this hook from everywhere. All you need is the menu id
	const { show } = useContextMenu({
		id: MENU_ID,
	});

	function handleItemClick({ event, props, triggerEvent, data }) {
		console.log(event, props, triggerEvent, data);
	}

	return (
		<Menu id={MENU_ID}>
			<Item onClick={handleItemClick}>Item 1</Item>
			<Item onClick={handleItemClick}>Item 2</Item>
			<Separator />
			<Item disabled>Disabled</Item>
			<Separator />
			<Submenu label="Submenu">
				<Item onClick={handleItemClick}>Sub Item 1</Item>
				<Item onClick={handleItemClick}>Sub Item 2</Item>
			</Submenu>
		</Menu>
	);
}
