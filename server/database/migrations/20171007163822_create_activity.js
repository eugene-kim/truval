
exports.up = function(knex, Promise) {
  return knex.schema.createTable('activity', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.datetime('start').notNullable();
    table.datetime('end');
    table.boolean('is_complete').notNullable().defaultTo(false);
    table.integer('duration');
    table.timestamps(true, true);

    // Foreign Keys
    table.integer('session_id').references('id').inTable('session');
    table.integer('category_id').references('id').inTable('category');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('activity');
};
