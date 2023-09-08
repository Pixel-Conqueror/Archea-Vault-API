import { useForm } from '@inertiajs/inertia-react';
import Modal from 'Components/Modal/Modal';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function CreateFolder({ parentFolderId }: { parentFolderId?: string }) {
	const { data, setData, post } = useForm({ name: '', parentId: parentFolderId });
	const [showForm, setShowForm] = useState<boolean>(false);

	const handleShowForm = () => setShowForm(true);
	const handleCloseForm = () => setShowForm(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		post('/folderCreate', {
			onFinish: () => toast('Folder creatd'),
		});
	};

	return (
		<div>
			<span onClick={handleShowForm}>Create folder</span>
			{showForm && (
				<Modal title="Create folder" close={handleCloseForm}>
					<form onSubmit={handleSubmit}>
						<input
							type="text"
							placeholder="Folder name"
							onChange={({ target }) => setData({ name: target.value, parentId: parentFolderId })}
							value={data.name}
						/>
						<button type="submit">Create</button>
					</form>
				</Modal>
			)}
		</div>
	);
}
