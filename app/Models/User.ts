import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import Hash from '@ioc:Adonis/Core/Hash';
import { column, beforeSave, BaseModel, computed, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import File from './File';
import Folder from './Folder';

export default class User extends BaseModel {
	@column({ isPrimary: true, serialize: (value: string) => value })
	public id: string = uuidv4();

	@column()
	public email: string;

	@column({ serializeAs: null })
	public password: string;

	@column()
	public firstName: string;

	@column()
	public lastName: string;

	@column()
	public isEmailVerified: boolean = false;

	@column()
	public role: number = 0;

	@column()
	public storageCapacity: number = 0;

	@column.dateTime({ autoCreate: true, serialize: (value: DateTime) => value.toISODate() })
	public createdAt: DateTime;

	@column.dateTime({
		autoCreate: true,
		autoUpdate: true,
		serialize: (value: DateTime) => value.toISODate(),
	})
	public updatedAt: DateTime;

	@computed()
	public get fullName() {
		return `${this.firstName} ${this.lastName}`;
	}

	@computed()
	public get storageCapacityInGB() {
		return this.storageCapacity / (1024 * 1024 * 1024);
	}

	@hasMany(() => File)
	public files: HasMany<typeof File>;

	@hasMany(() => Folder)
	public folders: HasMany<typeof Folder>;

	@beforeSave()
	public static async hashPassword(user: User) {
		if (user.$dirty.password) {
			user.password = await Hash.make(user.password);
		}
	}
}
