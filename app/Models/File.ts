import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, BelongsTo, belongsTo, computed, column } from '@ioc:Adonis/Lucid/Orm';
import User from './User';
import Folder from './Folder';

export default class File extends BaseModel {
	@column({ isPrimary: true, serialize: (value: string) => value })
	public id: string = uuidv4();

	@column()
	public userId: string = uuidv4();

	@column()
	public name: string;

	@column()
	public type: string;

	@column()
	public size: number;

	@column()
	public path: string;

	@column()
	public folderId?: null | string = uuidv4();

	@column.dateTime({ autoCreate: true, serialize: (value: DateTime) => value.toISODate() })
	public createdAt: DateTime;

	@column.dateTime({
		autoCreate: true,
		autoUpdate: true,
		serialize: (value: DateTime) => value.toISODate(),
	})
	public updatedAt: DateTime;

	@belongsTo(() => User)
	public user: BelongsTo<typeof User>;

	@belongsTo(() => Folder)
	public folder: BelongsTo<typeof Folder>;

	@computed()
	public get fileName() {
		return `${this.name}.${this.type}`;
	}
}
