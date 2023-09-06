import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';

export default interface UserInterface {
	profile(ctx: HttpContextContract): void;
	addStorage(email: string, amount?: number): Promise<User>;
}
