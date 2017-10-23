
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('activity').del()
    .then(function () {
      // Inserts seed entries
      return knex('activity').insert([

        // User 1
        {
          id: 1,
          name: 'Write seed data',
          start: '2017-10-21T00:00:00.000Z',
          end: '2017-10-21T00:20:00.000Z',
          is_complete: true,
          duration:1200,
          session_id: 1,
          category_id: 1
        },
        {
          id: 2,
          name: 'Lunch',
          start: '2017-10-21T00:20:00.000Z',
          end: '2017-10-21T00:30:00.000Z',
          is_complete: true,
          duration: 600,
          session_id: 1,
          category_id: 2
        },
        {
          id: 3,
          name: 'Poop',
          start: '2017-10-21T00:30:00.000Z',
          end: '2017-10-21T00:40:00.000Z',
          is_complete: true,
          duration: 600,
          session_id: 1,
          category_id: 3
        },
        {
          id: 4,
          name: 'Write test cases',
          start: '2017-10-21T00:40:00.000Z',
          end: '2017-10-21T00:55:00.000Z',
          is_complete: true,
          duration: 900,
          session_id: 1,
          category_id: 1
        },
        {
          id: 5,
          name: 'Cheer up girlfriend',
          start: '2017-10-21T00:55:00.000Z',
          end: '2017-10-21T01:40:00.000Z',
          is_complete: true,
          duration:2700,
          session_id: 1,
          category_id: 6
        },
        {
          id: 6,
          name: 'Reddit',
          start: '2017-10-21T01:40:00.000Z',
          end: '2017-10-21T02:40:00.000Z',
          is_complete: true,
          duration: 3600,
          session_id: 1,
          category_id: 4
        },
        {
          id: 7,
          name: 'Write seed data',
          start: '2017-10-21T02:40:00.000Z',
          end: '2017-10-21T04:00:00.000Z',
          is_complete: true,
          duration: 4800,
          session_id: 1,
          category_id: 1
        },
        {
          id: 8,
          name: 'Cheer up girlfriend',
          start: '2017-10-21T04:00:00.000Z',
          end: null,
          is_complete: false,
          duration: null,
          session_id: 1,
          category_id: 6
        },

        {
          id: 9,
          name: 'Write seed data',
          start: '2017-10-21T00:00:00.000Z',
          end: '2017-10-21T00:20:00.000Z',
          is_complete: true,
          duration:1200,
          session_id: 2,
          category_id: 1
        },
        {
          id: 10,
          name: 'Lunch',
          start: '2017-10-21T00:20:00.000Z',
          end: '2017-10-21T00:30:00.000Z',
          is_complete: true,
          duration: 600,
          session_id: 2,
          category_id: 2
        },
        {
          id: 11,
          name: 'Poop',
          start: '2017-10-21T00:30:00.000Z',
          end: '2017-10-21T00:40:00.000Z',
          is_complete: true,
          duration: 600,
          session_id: 2,
          category_id: 3
        },
        {
          id: 12,
          name: 'Write test cases',
          start: '2017-10-21T00:40:00.000Z',
          end: '2017-10-21T00:55:00.000Z',
          is_complete: true,
          duration: 900,
          session_id: 2,
          category_id: 1
        },
        {
          id: 13,
          name: 'Cheer up girlfriend',
          start: '2017-10-21T00:55:00.000Z',
          end: '2017-10-21T01:40:00.000Z',
          is_complete: true,
          duration:2700,
          session_id: 2,
          category_id: 6
        },
        {
          id: 14,
          name: 'Reddit',
          start: '2017-10-21T01:40:00.000Z',
          end: '2017-10-21T02:40:00.000Z',
          is_complete: true,
          duration: 3600,
          session_id: 2,
          category_id: 4
        },
        {
          id: 15,
          name: 'Write seed data',
          start: '2017-10-21T02:40:00.000Z',
          end: '2017-10-21T04:00:00.000Z',
          is_complete: true,
          duration: 4800,
          session_id: 2,
          category_id: 1
        },
        {
          id: 16,
          name: 'Cheer up girlfriend',
          start: '2017-10-21T04:00:00.000Z',
          end: null,
          is_complete: false,
          duration: null,
          session_id: 2,
          category_id: 6
        },

        {
          id: 17,
          name: 'Write seed data',
          start: '2017-10-21T00:00:00.000Z',
          end: '2017-10-21T00:20:00.000Z',
          is_complete: true,
          duration:1200,
          session_id: 3,
          category_id: 1
        },
        {
          id: 18,
          name: 'Lunch',
          start: '2017-10-21T00:20:00.000Z',
          end: '2017-10-21T00:30:00.000Z',
          is_complete: true,
          duration: 600,
          session_id: 3,
          category_id: 2
        },
        {
          id: 19,
          name: 'Poop',
          start: '2017-10-21T00:30:00.000Z',
          end: '2017-10-21T00:40:00.000Z',
          is_complete: true,
          duration: 600,
          session_id: 3,
          category_id: 3
        },
        {
          id: 20,
          name: 'Write test cases',
          start: '2017-10-21T00:40:00.000Z',
          end: '2017-10-21T00:55:00.000Z',
          is_complete: true,
          duration: 900,
          session_id: 3,
          category_id: 1
        },
        {
          id: 21,
          name: 'Cheer up girlfriend',
          start: '2017-10-21T00:55:00.000Z',
          end: '2017-10-21T01:40:00.000Z',
          is_complete: true,
          duration:2700,
          session_id: 3,
          category_id: 6
        },
        {
          id: 22,
          name: 'Reddit',
          start: '2017-10-21T01:40:00.000Z',
          end: '2017-10-21T02:40:00.000Z',
          is_complete: true,
          duration: 3600,
          session_id: 3,
          category_id: 4
        },
        {
          id: 23,
          name: 'Write seed data',
          start: '2017-10-21T02:40:00.000Z',
          end: '2017-10-21T04:00:00.000Z',
          is_complete: true,
          duration: 4800,
          session_id: 3,
          category_id: 1
        },
        {
          id: 24,
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
          id: 25,
          name: 'Write seed data',
          start: '2017-10-21T00:00:00.000Z',
          end: '2017-10-21T00:20:00.000Z',
          is_complete: true,
          duration:1200,
          session_id: 4,
          category_id: 7
        },
        {
          id: 26,
          name: 'Lunch',
          start: '2017-10-21T00:20:00.000Z',
          end: '2017-10-21T00:30:00.000Z',
          is_complete: true,
          duration: 600,
          session_id: 4,
          category_id: 8
        },
        {
          id: 27,
          name: 'Poop',
          start: '2017-10-21T00:30:00.000Z',
          end: '2017-10-21T00:40:00.000Z',
          is_complete: true,
          duration: 600,
          session_id: 4,
          category_id: 9
        },
        {
          id: 28,
          name: 'Write test cases',
          start: '2017-10-21T00:40:00.000Z',
          end: '2017-10-21T00:55:00.000Z',
          is_complete: true,
          duration: 900,
          session_id: 4,
          category_id: 7
        },
        {
          id: 29,
          name: 'Cheer up girlfriend',
          start: '2017-10-21T00:55:00.000Z',
          end: '2017-10-21T01:40:00.000Z',
          is_complete: true,
          duration:2700,
          session_id: 4,
          category_id: 12
        },
        {
          id: 30,
          name: 'Reddit',
          start: '2017-10-21T01:40:00.000Z',
          end: '2017-10-21T02:40:00.000Z',
          is_complete: true,
          duration: 3600,
          session_id: 4,
          category_id: 10
        },
        {
          id: 31,
          name: 'Write seed data',
          start: '2017-10-21T02:40:00.000Z',
          end: '2017-10-21T04:00:00.000Z',
          is_complete: true,
          duration: 4800,
          session_id: 4,
          category_id: 7
        },
        {
          id: 32,
          name: 'Cheer up girlfriend',
          start: '2017-10-21T04:00:00.000Z',
          end: null,
          is_complete: false,
          duration: null,
          session_id: 4,
          category_id: 12
        },

        {
          id: 33,
          name: 'Write seed data',
          start: '2017-10-21T00:00:00.000Z',
          end: '2017-10-21T00:20:00.000Z',
          is_complete: true,
          duration:1200,
          session_id: 5,
          category_id: 7
        },
        {
          id: 34,
          name: 'Lunch',
          start: '2017-10-21T00:20:00.000Z',
          end: '2017-10-21T00:30:00.000Z',
          is_complete: true,
          duration: 600,
          session_id: 5,
          category_id: 8
        },
        {
          id: 35,
          name: 'Poop',
          start: '2017-10-21T00:30:00.000Z',
          end: '2017-10-21T00:40:00.000Z',
          is_complete: true,
          duration: 600,
          session_id: 5,
          category_id: 9
        },
        {
          id: 36,
          name: 'Write test cases',
          start: '2017-10-21T00:40:00.000Z',
          end: '2017-10-21T00:55:00.000Z',
          is_complete: true,
          duration: 900,
          session_id: 5,
          category_id: 7
        },
        {
          id: 37,
          name: 'Cheer up girlfriend',
          start: '2017-10-21T00:55:00.000Z',
          end: '2017-10-21T01:40:00.000Z',
          is_complete: true,
          duration:2700,
          session_id: 5,
          category_id: 12
        },
        {
          id: 38,
          name: 'Reddit',
          start: '2017-10-21T01:40:00.000Z',
          end: '2017-10-21T02:40:00.000Z',
          is_complete: true,
          duration: 3600,
          session_id: 5,
          category_id: 10
        },
        {
          id: 39,
          name: 'Write seed data',
          start: '2017-10-21T02:40:00.000Z',
          end: '2017-10-21T04:00:00.000Z',
          is_complete: true,
          duration: 4800,
          session_id: 5,
          category_id: 7
        },
        {
          id: 40,
          name: 'Cheer up girlfriend',
          start: '2017-10-21T04:00:00.000Z',
          end: null,
          is_complete: false,
          duration: null,
          session_id: 5,
          category_id: 12
        },

        {
          id: 41,
          name: 'Write seed data',
          start: '2017-10-21T00:00:00.000Z',
          end: '2017-10-21T00:20:00.000Z',
          is_complete: true,
          duration:1200,
          session_id: 6,
          category_id: 7
        },
        {
          id: 42,
          name: 'Lunch',
          start: '2017-10-21T00:20:00.000Z',
          end: '2017-10-21T00:30:00.000Z',
          is_complete: true,
          duration: 600,
          session_id: 6,
          category_id: 8
        },
        {
          id: 43,
          name: 'Poop',
          start: '2017-10-21T00:30:00.000Z',
          end: '2017-10-21T00:40:00.000Z',
          is_complete: true,
          duration: 600,
          session_id: 6,
          category_id: 9
        },
        {
          id: 44,
          name: 'Write test cases',
          start: '2017-10-21T00:40:00.000Z',
          end: '2017-10-21T00:55:00.000Z',
          is_complete: true,
          duration: 900,
          session_id: 6,
          category_id: 7
        },
        {
          id: 45,
          name: 'Cheer up girlfriend',
          start: '2017-10-21T00:55:00.000Z',
          end: '2017-10-21T01:40:00.000Z',
          is_complete: true,
          duration:2700,
          session_id: 6,
          category_id: 12
        },
        {
          id: 46,
          name: 'Reddit',
          start: '2017-10-21T01:40:00.000Z',
          end: '2017-10-21T02:40:00.000Z',
          is_complete: true,
          duration: 3600,
          session_id: 6,
          category_id: 10
        },
        {
          id: 47,
          name: 'Write seed data',
          start: '2017-10-21T02:40:00.000Z',
          end: '2017-10-21T04:00:00.000Z',
          is_complete: true,
          duration: 4800,
          session_id: 6,
          category_id: 7
        },
        {
          id: 48,
          name: 'Cheer up girlfriend',
          start: '2017-10-21T04:00:00.000Z',
          end: '2017-10-21T05:00:00.000Z',
          is_complete: false,
          duration: 3600,
          session_id: 6,
          category_id: 12
        },
      ]);
    });
};
