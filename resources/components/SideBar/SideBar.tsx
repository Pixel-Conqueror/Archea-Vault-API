import { Link, usePage } from '@inertiajs/inertia-react';
import { AiFillClockCircle, AiFillCloud, AiFillHeart, AiFillHome } from 'react-icons/ai';
import { CiLogout } from 'react-icons/ci';
import { FaUserAlt } from 'react-icons/fa';
import { TbTrashFilled } from 'react-icons/tb';
import { MdAdminPanelSettings } from 'react-icons/md';

import { InertiaPage } from 'Types/inertia';
import { calculSize } from 'Utils/index';
import styles from './sidebar.module.scss';

const FAKE_STORAGE_USED = 1000 * 1000 * 1000 * 17.56;

export default function CloudSideBar({ showSpaceStorage = true }: { showSpaceStorage?: boolean }) {
	const { auth } = usePage<InertiaPage>().props;
	const isAdmin = auth.user?.role === 1;

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
						<Link href="/profile">
							<FaUserAlt /> {auth.user?.fullName}
						</Link>
					</li>
					<li className={styles['item']}>
						<Link href="/cloud-space">
							<AiFillCloud /> Cloud space
						</Link>
					</li>
					{isAdmin && (
						<li className={styles['item']}>
							<Link href="/admin">
								<MdAdminPanelSettings /> Admin
							</Link>
						</li>
					)}
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
			{showSpaceStorage && <SpaceStorageUsed />}
		</nav>
	);
}

function SpaceStorageUsed() {
	const { auth } = usePage<InertiaPage>().props;
	const maxStorageCapacity = Number(auth.user!.storageCapacity);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
			}}
		>
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
	);
}
