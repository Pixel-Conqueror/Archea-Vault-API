import { JobContract } from '@ioc:Rocketseat/Bull';
import Drive from '@ioc:Adonis/Core/Drive';
import File from 'App/Models/File';
import Logger from '@ioc:Adonis/Core/Logger';
import fs from 'fs/promises';
import Folder from 'App/Models/Folder';

/*
| https://docs.bullmq.io/
*/

export default class UploadFile implements JobContract {
	public key = 'UploadFile';

	public async handle(datas: any) {
		const { userId, file, tmpPath, folderId } = datas.data;
		try {
			const dbFile = await File.create({
				userId,
				name: file.clientName.replace(/\.[^/.]+$/, ''),
				type: file.extname,
				size: file.size,
				path: '',
				folderId: folderId ? folderId : null,
			});

			let filePath: string;

			if (folderId !== null) {
				const folder = await Folder.findOrFail(folderId);
				if (folder) {
					dbFile.folderId = folder.id;
					filePath = `${userId}${folder.path}/${folder.id}/${dbFile.id}.${dbFile.type}`;
				} else {
					filePath = `${userId}/${dbFile.id}.${dbFile.type}`;
				}
			} else {
				filePath = `${userId}/${dbFile.id}.${dbFile.type}`;
			}

			try {
				if (!filePath) {
					throw new Error("Le chemin du fichier n'a pas été défini.");
				}

				Logger.info(`Path = ${filePath}`);
				const buffer = await fs.readFile(tmpPath);
				await Drive.put(filePath, buffer);

				dbFile.path = filePath;
				await dbFile.save();
			} catch (error) {
				Logger.info(error);
				dbFile.delete();
			}

			Logger.info(
				`Fichier ${dbFile.name} au format .${dbFile.type} enregistré pour l'utilisateur ${userId} dans le path ${dbFile.path}`
			);
		} catch (error) {
			Logger.info(error);
		}
	}
}
