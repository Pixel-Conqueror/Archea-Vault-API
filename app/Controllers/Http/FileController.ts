// import Redis from '@ioc:Adonis/Addons/Redis';
import Drive from '@ioc:Adonis/Core/Drive';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Logger from '@ioc:Adonis/Core/Logger';
import Database from '@ioc:Adonis/Lucid/Database';
import UserController from '@ioc:Archea/UserController';
import Bull from '@ioc:Rocketseat/Bull';
import ConvertSizes from 'App/Helpers/ConvertSizes';
import UploadFile from 'App/Jobs/UploadFile';
import File from 'App/Models/File';
import Folder from 'App/Models/Folder';
import User from 'App/Models/User';
import FileUpdateValidator from 'App/Validators/FileUpdateValidator';
import UploadFileValidator from 'App/Validators/UploadFileValidator';
import FileInterface from 'Contracts/interfaces/File.interface';
import dayjs from 'dayjs';
import fs from 'fs-extra';
import path, { join } from 'path';

export default class FileController implements FileInterface {
	private userController;
	private ConvertSizes;

	constructor() {
		this.init();
	}

	protected async init() {
		this.userController = await UserController;
		this.ConvertSizes = await new ConvertSizes();
	}

	public async index({ auth, inertia }: HttpContextContract) {
		const folder = await this.getFilesFromUser(auth.user!);
		const totalUserStorage = await this.getTotalUserStorage(auth.user!);
		console.log('totalUserStorage', totalUserStorage);
		return inertia.render('CloudSpace', { folder, totalUserStorage });
	}

	public async getFilesFromUser(user: User) {
		try {
			// const redisKey = `folderStructure:${user.id}`;

			// const folderStructureFromRedis = await Redis.get(redisKey);
			// if (folderStructureFromRedis) {
			// 	return JSON.parse(folderStructureFromRedis);
			// }

			const rootPath = `tmp/uploads/${user.id}`;
			const folderStructure = await this.buildFolderStructure(rootPath);
			await this.enrichFolderStructureWithDBData(folderStructure);
			// await Redis.setex(redisKey, 86400, JSON.stringify(folderStructure));

			return folderStructure;
		} catch (error) {
			Logger.info(`[${user.email}] Files folder does not exist`);
			return [];
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

			const files = request.files('files');
			if (files.length === 0) {
				return response.status(401).json({
					error: 'No file uploaded',
				});
			}
			const { folderId } = await request.validate(UploadFileValidator);

			console.log('là folder', folderId);
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
			const { fileId } = request.params();

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

	public async getTotalUserStorage(user: User) {
		return (await Database.from('files').where('user_id', user.id!).sum('size'))?.[0].sum;
	}

	protected async calculateFileStatistics(): Promise<any> {
		const totalFiles = await Database.from('files').count('* as totalCount');
		const totalUsers = await this.userController.getUsersCount();
		const averageFilesPerUser = totalFiles[0].totalCount / totalUsers;
		const filesUploadedToday = await Database.from('files')
			.where('created_at', '>', dayjs().subtract(1, 'day').format('YYYY-MM-DD'))
			.count('* as totalTodayUploads');
		const totalSizeInBytes = await Database.from('files').sum('size as totalSizeInBytes');

		const totalSizeInGB = this.ConvertSizes.convertBytes(totalSizeInBytes[0].totalSizeInBytes);
		const averageSizePerUserInBytes = totalSizeInBytes[0].totalSizeInBytes / totalUsers;
		const averageSizePerUser = totalSizeInGB[0] / totalUsers;

		return {
			totalFiles: totalFiles[0].totalCount,
			averageFilesPerUser: averageFilesPerUser,
			filesUploadedToday: filesUploadedToday[0].totalTodayUploads,
			totalSizeInBytes: totalSizeInBytes[0].totalSizeInBytes,
			totalSize: `${totalSizeInGB[0]} ${totalSizeInGB[1]}`,
			averageSizePerUserInBytes: averageSizePerUserInBytes,
			averageSizePerUser: `${averageSizePerUser} ${totalSizeInGB[1]}`,
		};
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
		if (folderStructure.files.length > 0) {
			for (const file of folderStructure.files) {
				if (file.size) {
					continue;
				} else {
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
