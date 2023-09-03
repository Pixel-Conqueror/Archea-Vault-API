import { BsSearch } from 'react-icons/bs';
import styles from './searchbar.module.scss';

export default function SearchBar() {
	return (
		<div className={styles['searchbar']}>
			<BsSearch /> <input type="text" placeholder="Search" name="searchbar" id="searchbar" />
		</div>
	);
}
