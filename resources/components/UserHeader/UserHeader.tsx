import { AiOutlineUser } from 'react-icons/ai';
import { BiSolidBellRing } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';

import styles from './userheader.module.scss';

export default function UserHeader() {
	return (
		<div className={styles['user-header']}>
			<BiSolidBellRing />
			<AiOutlineUser />
			<BsThreeDotsVertical />
		</div>
	);
}
