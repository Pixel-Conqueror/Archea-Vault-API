import HealthCheck from '@ioc:Adonis/Core/HealthCheck';
import Route from '@ioc:Adonis/Core/Route';

Route.get('/', async ({ inertia }) => {
	return inertia.render('Home', { test: 'yes' });
});

Route.get('/cloud-space', async ({ inertia }) => {
	return inertia.render('CloudSpace');
});

//Authentication
Route.post('/register', 'AuthController.register');
Route.post('/login', 'AuthController.login');

Route.group(() => {
	//Authentication
	Route.get('/logout', 'AuthController.logout');
	//-------------------------------------

	//Files
	Route.get('/filesList', 'FileController.index');
	Route.post('/fileUpload', 'FileController.uploadFile').middleware('storageCapacity');
	Route.get('/fileDownload/:fileId', 'FileController.downloadFile');
	Route.patch('/fileUpdate', 'FileController.updateFile').middleware('fileAccess');
	Route.delete('/fileDelete', 'FileController.deleteFile').middleware('fileAccess');
	//-------------------------------------

	//Folders
	Route.post('/folderCreate', 'FolderController.create');
	Route.patch('/folderUpdate', 'FolderController.update');
}).middleware('auth');

//Monitoring
Route.get('/health', async ({ response }) => {
	const report = await HealthCheck.getReport();

	return report.healthy ? response.ok(report) : response.badRequest(report);
});
