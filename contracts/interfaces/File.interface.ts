import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import File from 'App/Models/File';

export default interface FileInterface {
	index(ctx: HttpContextContract): void;
}
