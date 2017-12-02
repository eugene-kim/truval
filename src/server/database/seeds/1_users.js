
exports.seed = async function(knex, Promise) {
  // Deletes ALL existing entries
  await knex('user').del();
  await knex.raw('ALTER SEQUENCE user_id_seq RESTART WITH 1');

  return knex('user').insert([
    {
      // id: 1,
      username: 'Huge Euge',
      email: 'hugeeuge@gmail.com',
      password: 'password',
    },
    {
      // id: 2,
      username: 'Bun',
      email: 'bunbun@gmail.com',
      password: 'password',
    }
  ]);
};
