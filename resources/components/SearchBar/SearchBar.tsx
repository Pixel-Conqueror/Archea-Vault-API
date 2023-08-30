import styles from './searchbar.module.scss';
console.log(styles);

export default function SearchBar() {
	return (
		<div className={styles['searchbar']}>
			<input type="text" placeholder="Rechercher" name="searchbar" id="searchbar" />
		</div>
	);
}
