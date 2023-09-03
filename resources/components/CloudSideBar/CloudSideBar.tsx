import { Link } from '@inertiajs/inertia-react';
import { AiFillClockCircle, AiFillCloud, AiFillHeart, AiFillHome } from 'react-icons/ai';
import { FaUserAlt } from 'react-icons/fa';
import { TbTrashFilled } from 'react-icons/tb';
import { CiLogout } from 'react-icons/ci';

import styles from './cloudsidebar.module.scss';

export default function CloudSideBar() {
	return (
		<nav className={styles['sidebar']}>
			<h1 className={styles['brand']}>My Space</h1>
			<nav>
				<div className={styles['caption']}>Navigation</div>
				<ul className={styles['items']}>
					<li className={styles['item']}>
						<Link href="/#">
							<AiFillHome /> Archea Vault
						</Link>
					</li>
					<li className={styles['item']}>
						<Link href="/#">
							<FaUserAlt /> My account
						</Link>
					</li>
					<li className={styles['item']}>
						<Link href="/logout">
							<CiLogout /> Logout
						</Link>
					</li>
				</ul>
				<div className={styles['caption']}>File manager</div>
				<ul className={styles['items']}>
					<li className={`${styles['item']} ${styles['active']}`}>
						<Link href="/#">
							<AiFillCloud size={20} /> Cloud Space
						</Link>
					</li>
					<li className={styles['item']}>
						<Link href="/#">
							<AiFillClockCircle size={20} /> Recent
						</Link>
					</li>
					<li className={styles['item']}>
						<Link href="/#">
							<AiFillHeart size={20} /> Favorites
						</Link>
					</li>
					<li className={styles['item']}>
						<Link href="/#">
							<TbTrashFilled size={20} />
							Trash
						</Link>
					</li>
				</ul>
			</nav>
			<div className={styles['storage-used']}>
				<Link href="/#">Increase your storage capacity</Link>
				<progress id="file" max="100" value="70">
					70%
				</progress>
				<div className="resume">
					You're using
					<br />
					<span className="color">17,56 GB</span> out of 20 GB
				</div>
			</div>
		</nav>
	);
}
