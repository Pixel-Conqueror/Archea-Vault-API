import HealthCheck from '@ioc:Adonis/Core/HealthCheck';
import Route from '@ioc:Adonis/Core/Route';

Route.inertia('/', 'Home');

// Authentication
Route.inertia('/login', 'Login');
Route.post('/login', 'AuthController.login');

Route.inertia('/register', 'Register');
Route.post('/register', 'AuthController.register');

// Route called by stripe whenever an event is triggered
Route.post('/stripe_hook', 'BillingController.stripeHook');

// Files
Route.group(() => {
	Route.inertia('/cloud-space', 'CloudSpace');
	Route.get('/profile', 'UserController.profile');
	Route.get('/logout', 'AuthController.logout');

	// Billing storage
	Route.get('/buy-storage', 'BillingController.checkout');
	Route.get('/invoices', 'BillingController.userInvoices');

	Route.get('/filesList', 'FileController.index');
	Route.post('/fileUpload', 'FileController.uploadFile').middleware('storageCapacity');
	Route.get('/fileDownload/:fileId', 'FileController.downloadFile');
	Route.patch('/fileUpdate', 'FileController.updateFile').middleware('fileAccess');
	Route.delete('/fileDelete', 'FileController.deleteFile').middleware('fileAccess');

	//Folders
	Route.post('/folderCreate', 'FolderController.create');
	Route.patch('/folderUpdate', 'FolderController.update');
}).middleware('auth');

Route.group(() => {
	Route.get('/admin', 'AdminController.index');
});

// Monitoring
Route.get('/health', async ({ response }) => {
	const report = await HealthCheck.getReport();
	return report.healthy ? response.ok(report) : response.badRequest(report);
});
