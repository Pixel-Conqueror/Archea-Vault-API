import { JobContract } from '@ioc:Rocketseat/Bull';
import Drive from '@ioc:Adonis/Core/Drive';
import File from 'App/Models/File';
import Logger from '@ioc:Adonis/Core/Logger';
import fs from 'fs/promises';

/*
| https://docs.bullmq.io/
*/

export default class UploadFile implements JobContract {
	public key = 'UploadFile';

	public async handle(datas: any) {
		const { userId, file, tmpPath } = datas.data;
		try {
			const dbFile = await File.create({
				userId,
				name: file.clientName.replace(/\.[^/.]+$/, ''),
				type: file.extname,
				size: file.size,
				path: '',
				folderId: null,
			});

			const buffer = await fs.readFile(tmpPath);

			const filePath = `${userId}/${dbFile.id}.${dbFile.type}`;
			try {
				await Drive.put(filePath, buffer);

				dbFile.path = filePath;
				await dbFile.save();
			} catch (error) {
				Logger.info(error);
				dbFile.delete();
			}

			Logger.info(
				`Fichier ${dbFile.name} au format .${dbFile.type} enregistré pour l'utilisateur ${userId}`
			);
		} catch (error) {
			Logger.info(error);
		}
	}
}
