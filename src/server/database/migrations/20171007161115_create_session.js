exports.up = function(knex, Promise) {
  return knex.schema.createTable('session', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.datetime('start').notNullable();
    table.datetime('end');
    table.boolean('is_complete').notNullable().defaultTo(false);
    table.timestamps(true, true);

    // Foreign Keys
    table.integer('user_id').references('id').inTable('user');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('session');
};
