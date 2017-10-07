
exports.up = function(knex, Promise) {
  knex.schema.createTable('session', table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.datetime('start').notNullable();
    table.datetime('end').;
    table.boolean('is_complete').defaultTo(false);
    table.timestamps.(true, true);

    // Foreign Keys
    table.integer('user_id').references('id').inTable('user');
  }
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('session');
};
