import { DateTime } from 'luxon';
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import { v4 as uuidv4 } from 'uuid';
import User from './User';
import File from './File';

export default class Folder extends BaseModel {
	@column({ isPrimary: true, serialize: (value: string) => value })
	public id: string = uuidv4();

	@column()
	public name: string;

	@column()
	public path: string;

	@column({ serializeAs: 'userId' })
	public userId: string = uuidv4();

	@column({ serializeAs: 'parentId' })
	public parentId: string = uuidv4();

	@column.dateTime({
		autoCreate: true,
		serializeAs: 'createdAt',
		serialize: (value: DateTime) => value.toISODate(),
	})
	public createdAt: DateTime;

	@column.dateTime({
		autoCreate: true,
		autoUpdate: true,
		serializeAs: 'updatedAt',
		serialize: (value: DateTime) => value.toISODate(),
	})
	public updatedAt: DateTime;

	@belongsTo(() => User)
	public user: BelongsTo<typeof User>;

	@belongsTo(() => Folder)
	public folder: BelongsTo<typeof Folder>;

	@hasMany(() => File)
	public files: HasMany<typeof File>;
}
