import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class FileUpdateValidator {
	constructor(protected ctx: HttpContextContract) {}

	public schema = schema.create({
		fileId: schema.string({ trim: true }, [rules.required()]),
		name: schema.string({ trim: true }, [rules.required()]),
	});

	public messages: CustomMessages = {
		'fileId.required': 'File id is required',
		'name.required': 'Name is required',
	};
}
