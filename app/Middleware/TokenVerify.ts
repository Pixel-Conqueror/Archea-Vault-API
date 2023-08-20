import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Redis from '@ioc:Adonis/Addons/Redis'

export default class VerifyToken {
  public async handle({ request, response, auth }: HttpContextContract, next: () => Promise<void>) {
    const authUser = await auth.use('api').authenticate()
    const token = request.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return response.unauthorized('Token manquant')
    }

    const userToken = await Redis.get(`userToken:${authUser.id}`)

    if (!userToken || userToken !== token) {
      return response.unauthorized('Token invalide ou expiré')
    }

    await next()
  }
}
