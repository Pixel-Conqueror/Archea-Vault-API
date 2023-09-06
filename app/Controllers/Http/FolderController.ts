import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Folder from 'App/Models/Folder';
import CreateFolderValidator from 'App/Validators/CreateFolderValidator';
import UpdateFolderValidator from 'App/Validators/UpdateFolderValidator';
import fs from 'fs/promises';
import path from 'path';
import Bull from '@ioc:Rocketseat/Bull';
import UpdateFoldersPath from 'App/Jobs/UpdateFoldersPath';

export default class FolderController {
	private fsPath: string;

	public async create({ request, auth }: HttpContextContract) {
		const userId = auth.user?.id;
		if (!userId) {
			return { error: 'User not authenticated' };
		}

		const { name, parentId } = await request.validate(CreateFolderValidator);

		try {
			let parentFolderPath = '';
			let folderPath = '';
			this.fsPath = `tmp/uploads/${userId}/`;

			if (parentId) {
				const parentFolder = await Folder.find(parentId);
				if (!parentFolder) {
					return { error: 'Parent folder not found' };
				}

				parentFolderPath = parentFolder.path;
				folderPath = `${parentFolderPath}/${parentId}`;
				this.fsPath = `tmp/uploads/${userId}/${folderPath}/`;
			}

			const folder = await Folder.create({
				userId,
				name,
				parentId,
				path: folderPath,
			});

			try {
				await fs.mkdir(path.resolve(this.fsPath, folder.id.toString()));
				await folder.save();

				return { success: true, folder };
			} catch (error) {
				await folder.delete();

				return { success: false, message: 'Failed to create folder on disk', error: error.message };
			}
		} catch (error) {
			return { success: false, error: error.message };
		}
	}

	public async update({ request, auth }: HttpContextContract) {
		const userId = auth.user?.id;
		if (!userId) {
			return { error: 'User not authenticated' };
		}
		const { name, folderId, parentId } = await request.validate(UpdateFolderValidator);

		try {
			const folder = await Folder.find(folderId);
			if (!folder) {
				return { error: 'Folder not found' };
			}

			if (name !== undefined && name !== folder.name) {
				folder.name = name;
			}

			if (parentId !== undefined && parentId !== folder.parentId) {
				const newParent = await Folder.find(parentId);
				if (!newParent) {
					return { error: 'New parent folder not found' };
				}

				await this.moveFolderToParent(folder, newParent, userId);
			}

			await folder.save();

			return { success: true, folder };
		} catch (error) {
			return { success: false, error: error.message };
		}
	}

	private async moveFolderToParent(folder: Folder, newParent: Folder, userId: string) {
		try {
			const fsCurrentPath =
				folder.path !== null
					? `tmp/uploads/${userId}${folder.path}/${folder.id}`
					: `tmp/uploads/${userId}/${folder.id}`;
			const fsNewPath =
				newParent.path !== null
					? `tmp/uploads/${userId}/${newParent.id}`
					: `tmp/uploads/${userId}${newParent.path}/${newParent.id}}`;

			await fs.rename(fsCurrentPath, fsNewPath);

			folder.parentId = newParent.id;
			folder.path = `${newParent.path}/${newParent.id}`;
			await folder.save();

			await Bull.add(
				new UpdateFoldersPath().key,
				{
					folder: folder,
				},
				{
					attempts: 3,
					removeOnComplete: {
						age: 24 * 3600,
						count: 100,
					},
					removeOnFail: {
						age: 24 * 3600 * 7,
						count: 500,
					},
				}
			);
		} catch (error) {
			throw new Error(error);
		}
	}
}
