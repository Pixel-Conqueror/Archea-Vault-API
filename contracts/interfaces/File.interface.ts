import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default interface FileInterface {
	index(ctx: HttpContextContract): Promise<any>;
	update(ctx: HttpContextContract): Promise<void>;
	uploadFile(ctx: HttpContextContract): Promise<void>;
	downloadFile(ctx: HttpContextContract): Promise<void>;
	deleteFile(ctx: HttpContextContract): Promise<void>;
}
