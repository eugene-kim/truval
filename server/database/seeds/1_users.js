
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('user').del()
    .then(function () {
      // Inserts seed entries
      return knex('user').insert([
        {id: 1, username: 'Huge Euge', email: 'hugeeuge@gmail.com', password: 'password'},
        {id: 2, username: 'Bun', email: 'bunbun@gmail.com', password: 'password'}
      ]);
    });
};
