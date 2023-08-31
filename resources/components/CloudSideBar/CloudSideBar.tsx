import { Link } from '@inertiajs/inertia-react';
import { AiFillClockCircle, AiFillCloud, AiFillHeart, AiFillHome } from 'react-icons/ai';
import { FaUserAlt } from 'react-icons/fa';
import { TbTrashFilled } from 'react-icons/tb';

import styles from './cloudsidebar.module.scss';

export default function CloudSideBar() {
	return (
		<nav className={styles['sidebar']}>
			<h1 className={styles['brand']}>Mon espace</h1>
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
							<FaUserAlt /> Mon compte
						</Link>
					</li>
				</ul>
				<div className={styles['caption']}>Gestionnaire de fichiers</div>
				<ul className={styles['items']}>
					<li className={`${styles['item']} ${styles['active']}`}>
						<Link href="/#">
							<AiFillCloud size={20} /> Espace Cloud
						</Link>
					</li>
					<li className={styles['item']}>
						<Link href="/#">
							<AiFillClockCircle size={20} /> Récents
						</Link>
					</li>
					<li className={styles['item']}>
						<Link href="/#">
							<AiFillHeart size={20} /> Favoris
						</Link>
					</li>
					<li className={styles['item']}>
						<Link href="/#">
							<TbTrashFilled size={20} />
							Corbeille
						</Link>
					</li>
				</ul>
			</nav>
			<div className={styles['storage-used']}>
				<Link href="/#">Augmenter votre espace de stockage</Link>
				<progress id="file" max="100" value="70">
					70%
				</progress>
				<div className="resume">
					Vous utilisez
					<br />
					<span className="color">17,56 Go</span> sur 20 Go
				</div>
			</div>
		</nav>
	);
}
