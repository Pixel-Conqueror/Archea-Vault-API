export function calculSize(value: bigint | number = BigInt(0), decimals: number = 2) {
	const octets = Number(value);
	if (octets === 0) return '0 Octet';

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Octets', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'];

	const i = Math.floor(Math.log(octets) / Math.log(k));

	return `${parseFloat((octets / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
