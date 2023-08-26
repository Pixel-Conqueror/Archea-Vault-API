import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import File from 'App/Models/File' // Remplacez le chemin par le chemin correct vers votre modèle de fichier

export default class VerifyFileAccess {
  public async handle({ request, auth, response }: HttpContextContract, next: () => Promise<void>) {
    const { fileId } = request.body()
    const user = auth.user

    if (!fileId) {
      return response.badRequest({ error: "L'identifiant du fichier est manquant" })
    }

    if (!user) {
      return response.unauthorized({ error: 'Utilisateur non authentifié' })
    }

    try {
      const file = await File.findOrFail(fileId)

      if (file.userId !== user.id) {
        return response.forbidden({ error: 'Accès refusé' })
      }
    } catch (error) {
      return response.notFound({ error: 'Fichier non trouvé' })
    }

    await next()
  }
}
