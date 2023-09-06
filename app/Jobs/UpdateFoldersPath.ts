import { JobContract } from '@ioc:Rocketseat/Bull';
import Folder from 'App/Models/Folder';
import File from 'App/Models/File';
import Logger from '@ioc:Adonis/Core/Logger';

export default class UpdateFoldersPath implements JobContract {
	public key = 'UpdateFoldersPath';

	public async handle(datas: any) {
		const { folder } = datas.data;
		await this.updateChildPaths(folder);
	}

	private async updateChildPaths(parentFolder: Folder) {
		const childFolders = await Folder.query().where('parent_id', parentFolder.id);
		const childFiles = await File.query().where('folder_id', parentFolder.id);

		for (const childFile of childFiles) {
			const newPath =
				parentFolder.path === ''
					? `/${parentFolder.id}/${childFile.id.toString()}`
					: `${parentFolder.path}/${parentFolder.id.toString()}/${childFile.id.toString()}`;
			Logger.info(`Nouveau chemin du fichier ${childFile.name} : ${newPath}`);

			childFile.path = newPath;
			await childFile.save();
		}

		for (const childFolder of childFolders) {
			const newPath =
				parentFolder.path === ''
					? `/${parentFolder.id}`
					: `${parentFolder.path}/${childFolder.id.toString()}`;
			Logger.info(`Nouveau chemin du dossier ${childFolder.name} : ${newPath}`);
			childFolder.path = newPath;
			await childFolder.save();

			await this.updateChildPaths(childFolder);
		}
	}
}
