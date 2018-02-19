exports.up = async function(knex, Promise) {
  await knex.schema.createTable('User', table => {
    table.uuid('id').primary();
    table.string('username').notNullable();
    table.string('password').notNullable();
    table.string('email').notNullable();
    table.timestamps(true, true);
  });

  await Promise.all([
    knex.schema.createTable('Session', table => {
      table.uuid('id').primary();
      table.string('name').notNullable();
      table.datetime('start').notNullable();
      table.datetime('end');
      table.boolean('is_complete').notNullable().defaultTo(false);
      table.timestamps(true, true);

      // Foreign Keys
      table.uuid('user_id').notNullable().references('id').inTable('User').onDelete('CASCADE');
    }),

    knex.schema.createTable('Category', table => {
      table.uuid('id').primary();
      table.string('name').notNullable();
      table.string('color').notNullable();
      table.boolean('is_primary').notNullable().defaultTo(false);
      table.timestamps(true, true);
      table.unique(['name', 'user_id']);

      // Foreign Keys
      table.uuid('user_id').notNullable().references('id').inTable('User').onDelete('CASCADE');
    }),
  ]);

  await knex.schema.createTable('ActivityType', table => {
    table.uuid('id').primary();
    table.string('name').notNullable();

    // When an ActivityType is created, it's created with an ActivityInstance, so
    // the starting value should be 1.
    table.integer('activity_count').notNullable().defaultTo(1);
    table.timestamps(true, true);
    table.unique(['name', 'user_id']);

    // Foreign Keys
    table.uuid('category_id').references('id').inTable('Category').onDelete('SET NULL');
    table.uuid('user_id').notNullable().references('id').inTable('User').onDelete('CASCADE');
  }),

  await knex.schema.createTable('ActivityInstance', table => {
    table.uuid('id').primary();
    table.datetime('start').notNullable();
    table.datetime('end');
    table.boolean('is_complete').notNullable().defaultTo(false);
    table.integer('duration');
    table.timestamps(true, true);

    // Foreign Keys
    table.uuid('activity_type_id').notNullable().references('id').inTable('ActivityType');
    table.uuid('session_id').notNullable().references('id').inTable('Session').onDelete('CASCADE');
  });
}

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('User'),
    knex.schema.dropTable('Session'),
    knex.schema.dropTable('Category'),
    knex.schema.dropTable('ActivityType'),
    knex.schema.dropTable('ActivityInstance'),
  ]);
};
