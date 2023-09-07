import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
	protected tableName = 'folders';

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.uuid('id').primary().unique();
			table.string('name').notNullable();
			table.text('path').notNullable();
			table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').index();
			table.uuid('parent_id').references('id').inTable('folders').onDelete('CASCADE').index();

			/**
			 * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
			 */
			table.timestamp('created_at', { useTz: true });
			table.timestamp('updated_at', { useTz: true });
		});
	}

	public async down() {
		this.schema.dropTable(this.tableName);
	}
}
