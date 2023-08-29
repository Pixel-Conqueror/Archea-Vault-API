import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class RegisterValidator {
	constructor(protected ctx: HttpContextContract) {}

	public schema = schema.create({
		email: schema.string({ trim: true }, [
			rules.required(),
			rules.email(),
			rules.unique({ table: 'users', column: 'email' }),
		]),
		password: schema.string({}, [rules.required(), rules.minLength(8)]),
		first_name: schema.string({ trim: true }, [rules.required(), rules.alpha()]),
		last_name: schema.string({ trim: true }, [rules.required(), rules.alpha()]),
	});

	public messages: CustomMessages = {
		'email.required': 'Email is required',
		'email.email': 'Incorrect email format',
		'email.unique': 'Email already taken',
		'password.required': 'Password is required',
		'password.minLength': 'Password must be at least 8 characters',
		'first_name.required': 'First name is required',
		'first_name.alpha': 'First name must contain only letters',
		'last_name.required': 'Last name is required',
		'last_name.alpha': 'Last name must contain only letters',
	};
}
