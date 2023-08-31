import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class VerifyStorageCapacity {
	public async handle({ request, auth, response }: HttpContextContract, next: () => Promise<void>) {
		const user = auth.user;

		if (!user) {
			return response.unauthorized({ error: 'Utilisateur non authentifié' });
		}

		const userStorageCapacity = user.storageCapacity;
		const files = request.files('files');

		if (!files) {
			return response.badRequest({ error: 'Aucun fichier dans la requête' });
		}

		const filesSize = files.reduce((acc: number, file: any) => acc + file.size, 0);
		const userFiles = await user.related('files').query();
		const userFilesSize = userFiles.reduce(
			(acc: number, file: any) => acc + parseInt(file.size, 10),
			0
		);

		if (filesSize + userFilesSize > userStorageCapacity) {
			return response.badRequest({ error: 'Capacité de stockage dépassée' });
		}

		await next();
	}
}
