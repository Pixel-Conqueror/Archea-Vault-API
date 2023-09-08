import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

const SIZE_LIMIT = 1000 * 1000 * 1024;

export default class UploadFileValidator {
	constructor(protected ctx: HttpContextContract) {}

	public schema = schema.create({
		files: schema.file({
			size: SIZE_LIMIT,
		}),
		folderId: schema.string.optional({ trim: true }, [
			rules.exists({ table: 'folders', column: 'id' }),
		]),
	});

	public messages: CustomMessages = {
		'folderId.string': 'Folder ID must be a string',
		'folderId.exists': 'Folder ID must exist',
	};
}
