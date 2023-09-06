import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class DeleteFolderValidator {
	constructor(protected ctx: HttpContextContract) {}

	public schema = schema.create({
		folderId: schema.string({ trim: true }, [rules.exists({ table: 'folders', column: 'id' })]),
	});

	public messages: CustomMessages = {
		'folderId.required': 'Folder ID is required',
		'folderId.string': 'Folder ID must be a string',
		'folderId.exists': 'Folder ID must exist',
	};
}
