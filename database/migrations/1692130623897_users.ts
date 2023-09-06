import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
	protected tableName = 'users';

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.uuid('id').primary().unique();
			table.string('email', 255).notNullable().unique();
			table.string('password', 180).notNullable();
			table.string('first_name', 255).notNullable();
			table.string('last_name', 255).notNullable();
			table.smallint('role').notNullable().defaultTo(0);
			table.boolean('is_email_verified').notNullable().defaultTo(0);
			table.bigint('storage_capacity').notNullable().defaultTo(0);

			/**
			 * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
			 */
			table.timestamp('created_at', { useTz: true }).notNullable();
			table.timestamp('updated_at', { useTz: true }).notNullable();
		});
	}

	public async down() {
		this.schema.dropTable(this.tableName);
	}
}
