import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class CreateFolderValidator {
	constructor(protected ctx: HttpContextContract) {}

	public schema = schema.create({
		name: schema.string({ trim: true }),
		parentId: schema.string.optional({ trim: true }, [
			rules.exists({ table: 'folders', column: 'id' }),
		]),
	});

	public messages: CustomMessages = {
		'name.required': 'Name is required',
		'name.string': 'Name must be a string',
		'parentId.string': 'Parent ID must be a string',
		'parentId.exists': 'Parent ID must exist',
	};
}
