import { useForm } from '@inertiajs/inertia-react';
import { useEffect } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';

export default function UploadFiles() {
	const { data, setData, post } = useForm({
		files: [],
	});

	useEffect(() => {
		if (data.files.length === 0) return;
		post('/fileUpload', {
			onFinish: () => alert(`File(s) uploaded`),
			onError: console.error,
		});
	}, [data]);
	const handleFiles = (e) => setData({ files: e.target.files });

	return (
		<>
			<label htmlFor="files">
				<AiOutlineCloudUpload /> Upload Files
			</label>
			<input
				type="file"
				multiple
				name="files"
				id="files"
				style={{ display: 'none' }}
				onChange={handleFiles}
			/>
		</>
	);
}
