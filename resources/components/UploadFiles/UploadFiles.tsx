import { useForm } from '@inertiajs/inertia-react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { toast } from 'react-toastify';

export default function UploadFiles() {
	const { post } = useForm({
		files: [],
	});

	const handleFiles = (e) =>
		post('/fileUpload', {
			onFinish: () => toast(`File(s) uploaded`),
			data: e.target.files,
		});

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
