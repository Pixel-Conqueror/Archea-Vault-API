export default class ConvertSizes {
	protected convertBytes(bytes: number): Array<any> {
		const MB = Math.pow(1024, 2);
		const GB = Math.pow(1024, 3);
		const TB = Math.pow(1024, 4);

		if (bytes >= TB) {
			return [parseFloat((bytes / TB).toFixed(2)), 'TB'];
		} else if (bytes >= GB) {
			return [parseFloat((bytes / GB).toFixed(2)), 'GB'];
		} else if (bytes >= MB) {
			return [parseFloat((bytes / MB).toFixed(2)), 'MB'];
		} else {
			return [bytes, 'Bytes'];
		}
	}
}
