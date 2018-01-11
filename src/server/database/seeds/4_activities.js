
exports.seed = async function(knex, Promise) {
  const table = 'activity';
  // Deletes ALL existing entries
  await knex('activity').del();

  // Resets the table's id sequence back to one. The database keep a record of the last insertion for
  // the user_id type so it can properly auto increment the next inserted row. Failure to reset
  // the id sequence and subsequently adding seed data that starts with `id: 1` will result in a
  // duplicate primary key error, even if you've deleted all the rows.
  await knex.raw('ALTER SEQUENCE activity_id_seq RESTART WITH 1');

  // We don't put ids in our seed data to allow for Postgres to increment properly.
  return knex(table).insert([

    // User 1
    {
      name: 'Write seed data',
      start: '2017-10-21T00:00:00.000Z',
      end: '2017-10-21T00:20:00.000Z',
      is_complete: true,
      duration:1200,
      session_id: 1,
      category_id: 1
    },
    {
      name: 'Lunch',
      start: '2017-10-21T00:20:00.000Z',
      end: '2017-10-21T00:30:00.000Z',
      is_complete: true,
      duration: 600,
      session_id: 1,
      category_id: 2
    },
    {
      name: 'Poop',
      start: '2017-10-21T00:30:00.000Z',
      end: '2017-10-21T00:40:00.000Z',
      is_complete: true,
      duration: 600,
      session_id: 1,
      category_id: 3
    },
    {
      name: 'Write test cases',
      start: '2017-10-21T00:40:00.000Z',
      end: '2017-10-21T00:55:00.000Z',
      is_complete: true,
      duration: 900,
      session_id: 1,
      category_id: 1
    },
    {
      name: 'Cheer up girlfriend',
      start: '2017-10-21T00:55:00.000Z',
      end: '2017-10-21T01:40:00.000Z',
      is_complete: true,
      duration:2700,
      session_id: 1,
      category_id: 6
    },
    {
      name: 'Reddit',
      start: '2017-10-21T01:40:00.000Z',
      end: '2017-10-21T02:40:00.000Z',
      is_complete: true,
      duration: 3600,
      session_id: 1,
      category_id: 4
    },
    {
      name: 'Write seed data',
      start: '2017-10-21T02:40:00.000Z',
      end: '2017-10-21T04:00:00.000Z',
      is_complete: true,
      duration: 4800,
      session_id: 1,
      category_id: 1
    },
    {
      name: 'Cheer up girlfriend',
      start: '2017-10-21T04:00:00.000Z',
      end: null,
      is_complete: false,
      duration: null,
      session_id: 1,
      category_id: 6
    },

    {
      name: 'Write seed data',
      start: '2017-10-21T00:00:00.000Z',
      end: '2017-10-21T00:20:00.000Z',
      is_complete: true,
      duration:1200,
      session_id: 2,
      category_id: 1
    },
    {
      name: 'Lunch',
      start: '2017-10-21T00:20:00.000Z',
      end: '2017-10-21T00:30:00.000Z',
      is_complete: true,
      duration: 600,
      session_id: 2,
      category_id: 2
    },
    {
      name: 'Poop',
      start: '2017-10-21T00:30:00.000Z',
      end: '2017-10-21T00:40:00.000Z',
      is_complete: true,
      duration: 600,
      session_id: 2,
      category_id: 3
    },
    {
      name: 'Write test cases',
      start: '2017-10-21T00:40:00.000Z',
      end: '2017-10-21T00:55:00.000Z',
      is_complete: true,
      duration: 900,
      session_id: 2,
      category_id: 1
    },
    {
      name: 'Cheer up girlfriend',
      start: '2017-10-21T00:55:00.000Z',
      end: '2017-10-21T01:40:00.000Z',
      is_complete: true,
      duration:2700,
      session_id: 2,
      category_id: 6
    },
    {
      name: 'Reddit',
      start: '2017-10-21T01:40:00.000Z',
      end: '2017-10-21T02:40:00.000Z',
      is_complete: true,
      duration: 3600,
      session_id: 2,
      category_id: 4
    },
    {
      name: 'Write seed data',
      start: '2017-10-21T02:40:00.000Z',
      end: '2017-10-21T04:00:00.000Z',
      is_complete: true,
      duration: 4800,
      session_id: 2,
      category_id: 1
    },
    {
      name: 'Cheer up girlfriend',
      start: '2017-10-21T04:00:00.000Z',
      end: null,
      is_complete: false,
      duration: null,
      session_id: 2,
      category_id: 6
    },

    {
      name: 'Write seed data',
      start: '2017-10-21T00:00:00.000Z',
      end: '2017-10-21T00:20:00.000Z',
      is_complete: true,
      duration:1200,
      session_id: 3,
      category_id: 1
    },
    {
      name: 'Lunch',
      start: '2017-10-21T00:20:00.000Z',
      end: '2017-10-21T00:30:00.000Z',
      is_complete: true,
      duration: 600,
      session_id: 3,
      category_id: 2
    },
    {
      name: 'Poop',
      start: '2017-10-21T00:30:00.000Z',
      end: '2017-10-21T00:40:00.000Z',
      is_complete: true,
      duration: 600,
      session_id: 3,
      category_id: 3
    },
    {
      name: 'Write test cases',
      start: '2017-10-21T00:40:00.000Z',
      end: '2017-10-21T00:55:00.000Z',
      is_complete: true,
      duration: 900,
      session_id: 3,
      category_id: 1
    },
    {
      name: 'Cheer up girlfriend',
      start: '2017-10-21T00:55:00.000Z',
      end: '2017-10-21T01:40:00.000Z',
      is_complete: true,
      duration:2700,
      session_id: 3,
      category_id: 6
    },
    {
      name: 'Reddit',
      start: '2017-10-21T01:40:00.000Z',
      end: '2017-10-21T02:40:00.000Z',
      is_complete: true,
      duration: 3600,
      session_id: 3,
      category_id: 4
    },
    {
      name: 'Write seed data',
      start: '2017-10-21T02:40:00.000Z',
      end: '2017-10-21T04:00:00.000Z',
      is_complete: true,
      duration: 4800,
      session_id: 3,
      category_id: 1
    },
    {
      name: 'Cheer up girlfriend',
      start: '2017-10-21T04:00:00.000Z',
      end: '2017-10-21T05:00:00.000Z',
      is_complete: false,
      duration: 3600,
      session_id: 3,
      category_id: 6
    },

    // User 2
    {
      name: 'Write seed data',
      start: '2017-10-21T00:00:00.000Z',
      end: '2017-10-21T00:20:00.000Z',
      is_complete: true,
      duration:1200,
      session_id: 4,
      category_id: 7
    },
    {
      name: 'Lunch',
      start: '2017-10-21T00:20:00.000Z',
      end: '2017-10-21T00:30:00.000Z',
      is_complete: true,
      duration: 600,
      session_id: 4,
      category_id: 8
    },
    {
      name: 'Poop',
      start: '2017-10-21T00:30:00.000Z',
      end: '2017-10-21T00:40:00.000Z',
      is_complete: true,
      duration: 600,
      session_id: 4,
      category_id: 9
    },
    {
      name: 'Write test cases',
      start: '2017-10-21T00:40:00.000Z',
      end: '2017-10-21T00:55:00.000Z',
      is_complete: true,
      duration: 900,
      session_id: 4,
      category_id: 7
    },
    {
      name: 'Cheer up girlfriend',
      start: '2017-10-21T00:55:00.000Z',
      end: '2017-10-21T01:40:00.000Z',
      is_complete: true,
      duration:2700,
      session_id: 4,
      category_id: 12
    },
    {
      name: 'Reddit',
      start: '2017-10-21T01:40:00.000Z',
      end: '2017-10-21T02:40:00.000Z',
      is_complete: true,
      duration: 3600,
      session_id: 4,
      category_id: 10
    },
    {
      name: 'Write seed data',
      start: '2017-10-21T02:40:00.000Z',
      end: '2017-10-21T04:00:00.000Z',
      is_complete: true,
      duration: 4800,
      session_id: 4,
      category_id: 7
    },
    {
      name: 'Cheer up girlfriend',
      start: '2017-10-21T04:00:00.000Z',
      end: null,
      is_complete: false,
      duration: null,
      session_id: 4,
      category_id: 12
    },

    {
      name: 'Write seed data',
      start: '2017-10-21T00:00:00.000Z',
      end: '2017-10-21T00:20:00.000Z',
      is_complete: true,
      duration:1200,
      session_id: 5,
      category_id: 7
    },
    {
      name: 'Lunch',
      start: '2017-10-21T00:20:00.000Z',
      end: '2017-10-21T00:30:00.000Z',
      is_complete: true,
      duration: 600,
      session_id: 5,
      category_id: 8
    },
    {
      name: 'Poop',
      start: '2017-10-21T00:30:00.000Z',
      end: '2017-10-21T00:40:00.000Z',
      is_complete: true,
      duration: 600,
      session_id: 5,
      category_id: 9
    },
    {
      name: 'Write test cases',
      start: '2017-10-21T00:40:00.000Z',
      end: '2017-10-21T00:55:00.000Z',
      is_complete: true,
      duration: 900,
      session_id: 5,
      category_id: 7
    },
    {
      name: 'Cheer up girlfriend',
      start: '2017-10-21T00:55:00.000Z',
      end: '2017-10-21T01:40:00.000Z',
      is_complete: true,
      duration:2700,
      session_id: 5,
      category_id: 12
    },
    {
      name: 'Reddit',
      start: '2017-10-21T01:40:00.000Z',
      end: '2017-10-21T02:40:00.000Z',
      is_complete: true,
      duration: 3600,
      session_id: 5,
      category_id: 10
    },
    {
      name: 'Write seed data',
      start: '2017-10-21T02:40:00.000Z',
      end: '2017-10-21T04:00:00.000Z',
      is_complete: true,
      duration: 4800,
      session_id: 5,
      category_id: 7
    },
    {
      name: 'Cheer up girlfriend',
      start: '2017-10-21T04:00:00.000Z',
      end: null,
      is_complete: false,
      duration: null,
      session_id: 5,
      category_id: 12
    },

    {
      name: 'Write seed data',
      start: '2017-10-21T00:00:00.000Z',
      end: '2017-10-21T00:20:00.000Z',
      is_complete: true,
      duration:1200,
      session_id: 6,
      category_id: 7
    },
    {
      name: 'Lunch',
      start: '2017-10-21T00:20:00.000Z',
      end: '2017-10-21T00:30:00.000Z',
      is_complete: true,
      duration: 600,
      session_id: 6,
      category_id: 8
    },
    {
      name: 'Poop',
      start: '2017-10-21T00:30:00.000Z',
      end: '2017-10-21T00:40:00.000Z',
      is_complete: true,
      duration: 600,
      session_id: 6,
      category_id: 9
    },
    {
      name: 'Write test cases',
      start: '2017-10-21T00:40:00.000Z',
      end: '2017-10-21T00:55:00.000Z',
      is_complete: true,
      duration: 900,
      session_id: 6,
      category_id: 7
    },
    {
      name: 'Cheer up girlfriend',
      start: '2017-10-21T00:55:00.000Z',
      end: '2017-10-21T01:40:00.000Z',
      is_complete: true,
      duration:2700,
      session_id: 6,
      category_id: 12
    },
    {
      name: 'Reddit',
      start: '2017-10-21T01:40:00.000Z',
      end: '2017-10-21T02:40:00.000Z',
      is_complete: true,
      duration: 3600,
      session_id: 6,
      category_id: 10
    },
    {
      name: 'Write seed data',
      start: '2017-10-21T02:40:00.000Z',
      end: '2017-10-21T04:00:00.000Z',
      is_complete: true,
      duration: 4800,
      session_id: 6,
      category_id: 7
    },
    {
      name: 'Cheer up girlfriend',
      start: '2017-10-21T04:00:00.000Z',
      end: '2017-10-21T05:00:00.000Z',
      is_complete: false,
      duration: 3600,
      session_id: 6,
      category_id: 12
    },
  ]);
};
