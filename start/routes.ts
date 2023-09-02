import HealthCheck from '@ioc:Adonis/Core/HealthCheck';
import Route from '@ioc:Adonis/Core/Route';

Route.get('/', async ({ inertia }) => inertia.render('Home'));

// Authentication
Route.get('/login', async ({ inertia }) => inertia.render('Login'));
Route.post('/login', 'AuthController.login');

Route.get('/register', async ({ inertia }) => inertia.render('Register'));
Route.post('/register', 'AuthController.register');

// Files
Route.group(() => {
	Route.get('/cloud-space', async ({ inertia, auth }) => {
		console.log(auth.name);
		return inertia.render('CloudSpace');
	});
	Route.get('/logout', 'AuthController.logout');

	Route.get('/filesList', 'FileController.index');
	Route.post('/fileUpload', 'FileController.uploadFile').middleware('storageCapacity');
	Route.get('/fileDownload/:fileId', 'FileController.downloadFile');
	Route.patch('/fileUpdate', 'FileController.updateFile').middleware('fileAccess');
	Route.delete('/fileDelete', 'FileController.deleteFile').middleware('fileAccess');
}).middleware('auth');

// Monitoring
Route.get('/health', async ({ response }) => {
	const report = await HealthCheck.getReport();
	return report.healthy ? response.ok(report) : response.badRequest(report);
});
