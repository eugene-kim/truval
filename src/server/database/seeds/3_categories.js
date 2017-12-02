
exports.seed = async function(knex, Promise) {
  // Deletes ALL existing entries
  await knex('category').del();
  await knex.raw('ALTER SEQUENCE category_id_seq RESTART WITH 1');

  return knex('category').insert([
    {
      // id: 1,
      name: 'CODE',
      is_primary: true,
      color: '#3E416A',
      user_id: 1,
    },
    {
      // id: 2,
      name: 'EAT',
      color: '#E9696A',
      user_id: 1,
    },
    {
      // id: 3,
      name: 'POTTY',
      color: '#BBD8CB',
      user_id: 1,
    },
    {
      // id: 4,
      name: 'INTERNET',
      color: '#4ACDDE',
      user_id: 1,
    },
    {
      // id: 5,
      name: 'TRANSIT',
      color: '#866981',
      user_id: 1,
    },
    {
      // id: 6,
      name: 'MISC',
      color: '#FCD66B',
      user_id: 1,
    },

    {
      // id: 7,
      name: 'CODE',
      is_primary: true,
      color: '#3E416A',
      user_id: 2,
    },
    {
      // id: 8,
      name: 'EAT',
      color: '#E9696A',
      user_id: 2,
    },
    {
      // id: 9,
      name: 'POTTY',
      color: '#BBD8CB',
      user_id: 2,
    },
    {
      // id: 10,
      name: 'INTERNET',
      color: '#4ACDDE',
      user_id: 2,
    },
    {
      // id: 11,
      name: 'TRANSIT',
      color: '#866981',
      user_id: 2,
    },
    {
      // id: 12,
      name: 'MISC',
      color: '#FCD66B',
      user_id: 2,
    },
  ]);
};
