import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class AuthValidator {
	constructor(protected ctx: HttpContextContract) {}

	public schema = schema.create({
		email: schema.string({ trim: true }, [rules.required(), rules.email()]),
		password: schema.string({}, [rules.required(), rules.minLength(8)]),
	});

	public messages: CustomMessages = {
		'email.required': 'Email is required',
		'email.email': 'Incorrect email format',
		'password.required': 'Password is required',
		'password.minLength': 'Password must be at least 8 characters',
	};
}
