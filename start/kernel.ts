/*
|--------------------------------------------------------------------------
| Application middleware
|--------------------------------------------------------------------------
|
| This file is used to define middleware for HTTP requests. You can register
| middleware as a `closure` or an IoC container binding. The bindings are
| preferred, since they keep this file clean.
|
*/

import Server from '@ioc:Adonis/Core/Server';

/*
|--------------------------------------------------------------------------
| Global middleware
|--------------------------------------------------------------------------
|
| An array of global middleware, that will be executed in the order they
| are defined for every HTTP requests.
|
*/
Server.middleware.register([
	() => import('@ioc:Adonis/Core/BodyParser'),
	() => import('@ioc:EidelLev/Inertia/Middleware'),
]);

Server.middleware.registerNamed({
	auth: () => import('App/Middleware/Auth'),
	silentAuth: () => import('App/Middleware/SilentAuth'),
	fileAccess: () => import('App/Middleware/VerifyFileAccess'),
	storageCapacity: () => import('App/Middleware/VerifyStorageCapacity'),
});
