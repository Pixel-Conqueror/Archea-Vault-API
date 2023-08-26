import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bull from '@ioc:Rocketseat/Bull'
import Drive from '@ioc:Adonis/Core/Drive'
import File from 'App/Models/File'
import UploadFile from 'App/Jobs/UploadFile'

export default class FileController {
  public async index({ auth, response }: HttpContextContract) {
    try {
      const user = auth.user
      await user?.load('files')

      if (!user?.files) {
        return response.ok({ message: 'Aucun fichier' })
      } else {
        return response.ok({ files: user?.files })
      }
    } catch (error) {
      return response.badRequest({ message: 'Impossible de récupérer les fichiers', error: error })
    }
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const { fileId, name } = request.body()

      const file = await File.findOrFail(fileId)

      file.name = name
      await file.save()

      return response.ok({ message: 'Nom du fichier mis à jour' })
    } catch (error) {
      return response.status(404).json({ message: 'Fichier non trouvé', error: error })
    }
  }

  public async uploadFile({ request, auth, response }: HttpContextContract) {
    try {
      const userId = auth.user?.id
      const files = request.files('files')

      const filesDatas = files.map((file: any) => ({
        userId: userId,
        file: file,
        tmpPath: file.tmpPath,
      }))

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
          })
        })
      )

      return response.status(201).json({ message: "Fichiers en attente d'upload" })
    } catch (error) {
      return response.badRequest({ message: "Impossible d'uploader les fichiers", error: error })
    }
  }

  public async downloadFile({ auth, request, response }: HttpContextContract) {
    try {
      const userId = auth.user?.id
      const { fileId } = request.body()

      const file = await File.findOrFail(fileId)
      if (file.userId !== userId) {
        return response.status(401).json({ message: 'Vous ne pouvez pas télécharger ce fichier' })
      }

      const signedUrl = await Drive.getSignedUrl(file.path)

      return response.redirect(signedUrl)
    } catch (error) {
      return response.status(404).json({ message: 'Fichier non trouvé', error: error })
    }
  }

  public async deleteFile({ request, response }: HttpContextContract) {
    try {
      const { fileId } = request.body()

      const file = await File.findOrFail(fileId)

      await Drive.delete(file.path)

      await file.delete()

      return response.ok({ message: 'Fichier supprimé' })
    } catch (error) {
      return response.status(404).json({ message: 'Fichier non trouvé', error: error })
    }
  }
}
