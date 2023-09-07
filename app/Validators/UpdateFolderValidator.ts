import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class CreateFolderValidator {
	constructor(protected ctx: HttpContextContract) {}

	public schema = schema.create({
		name: schema.string.optional({ trim: true }),
		folderId: schema.string({ trim: true }, [rules.exists({ table: 'folders', column: 'id' })]),
		parentId: schema.string.optional({ trim: true }, [
			rules.exists({ table: 'folders', column: 'id' }),
		]),
	});

	public messages: CustomMessages = {
		'name.string': 'Name must be a string',
		'folderId.required': 'Folder ID is required',
		'folderId.string': 'Folder ID must be a string',
		'folderId.exists': 'Folder ID must exist',
		'parentId.string': 'Parent ID must be a string',
		'parentId.exists': 'Parent ID must exist',
	};
}
