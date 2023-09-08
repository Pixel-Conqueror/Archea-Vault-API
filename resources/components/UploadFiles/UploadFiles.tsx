import { useForm } from '@inertiajs/inertia-react';
import { useEffect } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';

export default function UploadFiles({ folderId }: { folderId?: string }) {
	const { data, setData } = useForm({
		files: [],
	});

	useEffect(() => {
		if (data.files.length === 0) return;
		const formData = new FormData();
		for (const file of data.files as any) {
			formData.append('files', file, file.name);
		}

		if (folderId) {
			formData.append('folderId', folderId);
		}

		fetch('/fileUpload', {
			method: 'post',
			body: formData,
		})
			.then(() => {
				alert(`File(s) uploaded`);
				window.location.reload();
			})
			.catch(() => alert('Something went wrong while uploading file'));
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
