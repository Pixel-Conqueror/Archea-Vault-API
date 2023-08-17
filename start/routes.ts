import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

//Authentication
Route.post('/register', 'AuthController.register')
Route.post('/login', 'AuthController.login')
Route.get('/logout', 'AuthController.logout').middleware(['token', 'auth'])

//Monitoring
Route.get('/isAuth', 'AuthController.isAuthenticated').middleware(['token', 'auth'])
Route.get('/health', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy ? response.ok(report) : response.badRequest(report)
})
