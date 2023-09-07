import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Bull from '@ioc:Rocketseat/Bull';
import Drive from '@ioc:Adonis/Core/Drive';
import File from 'App/Models/File';
import UploadFile from 'App/Jobs/UploadFile';
import FileUpdateValidator from 'App/Validators/FileUpdateValidator';
import fs from 'fs-extra';
import path from 'path';
import { join } from 'path';
import Folder from 'App/Models/Folder';
import Redis from '@ioc:Adonis/Addons/Redis';
import UploadFileValidator from 'App/Validators/UploadFileValidator';

export default class FileController {
	public async index({ params, auth, response }: HttpContextContract) {
		const { userId } = params;
		if (!userId) {
			return response.status(401).json({ error: 'User not authenticated' });
		}

		try {
			const redisKey = `folderStructure:${userId}`;

			const folderStructureFromRedis = await Redis.get(redisKey);
			if (folderStructureFromRedis) {
				return response.ok(JSON.parse(folderStructureFromRedis));
			}

			const rootPath = `tmp/uploads/${userId}`;
			const folderStructure = await this.buildFolderStructure(rootPath);
			await this.enrichFolderStructureWithDBData(folderStructure);
			await Redis.setex(redisKey, 86400, JSON.stringify(folderStructure));

			return response.status(200).json(folderStructure);
		} catch (error) {
			return response.status(500).json({ error: error });
		}
	}

	public async update({ request, response }: HttpContextContract) {
		try {
			const { fileId, name } = await request.validate(FileUpdateValidator);
			const file = await File.findOrFail(fileId);

			file.name = name;
			await file.save();

			return response.ok({ message: 'Nom du fichier mis à jour' });
		} catch (error) {
			return response.status(404).json({ message: 'Fichier non trouvé', error: error });
		}
	}

	public async uploadFile({ request, auth, response }: HttpContextContract) {
		try {
			const userId = auth.user?.id;
			if (!userId) {
				return response.status(401).json({ error: 'User not authenticated' });
			}

			const { folderId } = await request.validate(UploadFileValidator);
			const files = request.files('files');

			const filesDatas = files.map((file: any) => ({
				userId: userId,
				file: file,
				tmpPath: file.tmpPath,
				folderId: folderId ? folderId : null,
			}));

			await Promise.all(
				filesDatas.map(async (fileDatas: any) => {
					await Bull.add(new UploadFile().key, fileDatas, {
						attempts: 3,
						removeOnComplete: {
							age: 24 * 3600,
							count: 100,
						},
						removeOnFail: {
							age: 24 * 3600 * 7,
							count: 500,
						},
					});
				})
			);

			return response.status(201).json({ message: "Fichiers en attente d'upload" });
		} catch (error) {
			return response.badRequest({ message: "Impossible d'uploader les fichiers", error: error });
		}
	}

	public async downloadFile({ auth, request, response }: HttpContextContract) {
		try {
			const userId = auth.user?.id;
			const { fileId } = request.body();

			const file = await File.findOrFail(fileId);
			if (file.userId !== userId) {
				return response.status(401).json({ message: 'Vous ne pouvez pas télécharger ce fichier' });
			}

			const signedUrl = await Drive.getSignedUrl(file.path);

			return response.redirect(signedUrl);
		} catch (error) {
			return response.status(404).json({ message: 'Fichier non trouvé', error: error });
		}
	}

	public async deleteFile({ request, response }: HttpContextContract) {
		try {
			const { fileId } = request.body();

			const file = await File.findOrFail(fileId);

			await Drive.delete(file.path);

			await file.delete();

			return response.ok({ message: 'Fichier supprimé' });
		} catch (error) {
			return response.status(404).json({ message: 'Fichier non trouvé', error: error });
		}
	}

	private async buildFolderStructure(folderPath: string): Promise<any> {
		const folderId = path.basename(folderPath);
		const folderStructure: any = {
			id: folderId,
			path: folderPath,
			type: 'folder',
			files: [],
			children: [],
		};

		const items = await fs.readdir(folderPath);

		for (const item of items) {
			const itemPath = join(folderPath, item);
			const stats = await fs.stat(itemPath);

			if (stats.isDirectory()) {
				const subFolderStructure = await this.buildFolderStructure(itemPath);
				folderStructure.children.push(subFolderStructure);
			} else {
				folderStructure.files.push({
					name: item,
					id: item.split('.')[0],
					type: 'file',
				});
			}
		}

		return folderStructure;
	}

	private async enrichFolderStructureWithDBData(folderStructure: any): Promise<void> {
		for (const folder of folderStructure.children) {
			if (folder.type === 'folder') {
				const folderId = folder.id;
				const folderData = await Folder.findOrFail(folderId);

				folder.name = folderData.name;
				folder.relativePath = folderData.path;
				folder.createdAt = folderData.createdAt;
				if (folder.files.length > 0) {
					for (const file of folder.files) {
						const fileId = file.id;
						const fileData = await File.findOrFail(fileId);

						file.name = fileData.name;
						file.type = fileData.type;
						file.size = fileData.size;
						file.path = fileData.path;
						file.createdAt = fileData.createdAt;
					}
				}
			}

			if (folder.children.length > 0) {
				await this.enrichFolderStructureWithDBData(folder);
			}
		}
	}
}
