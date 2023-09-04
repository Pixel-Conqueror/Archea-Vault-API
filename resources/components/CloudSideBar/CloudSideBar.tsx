import { Link, usePage } from '@inertiajs/inertia-react';
import { AiFillClockCircle, AiFillCloud, AiFillHeart, AiFillHome } from 'react-icons/ai';
import { CiLogout } from 'react-icons/ci';
import { FaUserAlt } from 'react-icons/fa';
import { TbTrashFilled } from 'react-icons/tb';

import { InertiaPage } from 'Types/inertia';
import styles from './cloudsidebar.module.scss';
import { calculSize } from 'Utils/index';

const FAKE_STORAGE_USED = 17560000000;

export default function CloudSideBar() {
	const { auth } = usePage<InertiaPage>().props;
	const maxStorageCapacity = Number(auth.user!.storageCapacity);

	return (
		<nav className={styles['sidebar']}>
			<h1 className={styles['brand']}>Cloud Space</h1>
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
				<a href="/buy-storage">Increase your storage capacity (20€)</a>
				<progress id="file" max={maxStorageCapacity} value={FAKE_STORAGE_USED}>
					70%
				</progress>
				<div className="resume">
					You're using
					<br />
					<span className="color">{calculSize(FAKE_STORAGE_USED)}</span> out of{' '}
					{auth.user!.storageCapacityInGB} GB
				</div>
			</div>
		</nav>
	);
}
