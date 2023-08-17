import Redis from '@ioc:Adonis/Addons/Redis'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import AuthValidator from 'App/Validators/AuthValidator'
import RegisterValidator from 'App/Validators/RegisterValidator'

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    try {
      const datas = await request.validate(RegisterValidator)
      const user = await User.create(datas)

      return user
    } catch (error) {
      return response.badRequest(error.messages)
    }
  }

  public async login({ request, response, auth }: HttpContextContract) {
    try {
      const { email, password } = await request.validate(AuthValidator)
      const datas = await auth.use('api').attempt(email, password, { expiresIn: '1 days' })

      await Redis.set(`user:${datas.user.id}`, datas.token, 'EX', 3600) // Expiration en secondes (1 heure)

      return response.ok({ token: datas.token, user: datas.user })
    } catch (error) {
      let message: string
      switch (error.code) {
        case 'E_INVALID_AUTH_UID':
          message = 'Email not found'
          break
        case 'E_INVALID_AUTH_PASSWORD':
          message = 'Password is incorrect'
          break
        default:
          message = 'Unable to login'
      }
      return response.unauthorized(message)
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    try {
      if (!auth.user) {
        return response.badRequest({ error: 'You are not logged in' })
      }

      const userToken = await Redis.get(`user:${auth.user.id}`) // Récupère le token de Redis

      if (userToken) {
        // Suppression de la clé associée au token dans Redis
        await Redis.del(`user:${auth.user.id}`)
      }

      await auth.use('api').revoke() // Révoque le token avec Adonis

      return response.ok({ revoked: true })
    } catch (error) {
      return response.badRequest(error.messages)
    }
  }

  public async isAuthenticated({ auth, response }: HttpContextContract) {
    try {
      if (!auth.user) {
        return response.badRequest({ error: 'You are not logged in' })
      }

      return response.ok({ authenticated: true })
    } catch (error) {
      return response.badRequest(error.messages)
    }
  }
}
