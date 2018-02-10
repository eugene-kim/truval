export default {
  entities: {
    user: {
      entities: {},
    },

    session: {
      entities: {

        // TODO: Remove after finishing testing.
        '1': {
          id: 1,
          name: 'Study Session 1',
          start: '2017-10-21T22:51:09.489Z',
          end: null,
          is_complete: false,
          user_id: 1,
          activities: [1,2],
        },
      },
    },

    activity: {
      entities: {
        
        // TODO: Remove after finishing testing.
        '1': {
          id: 1,
          name: 'Write seed data',
          start: '2017-10-21T00:00:00.000Z',
          end: '2017-10-21T00:20:00.000Z',
          is_complete: true,
          duration:1200,
          session_id: 1,
          category_id: 1
        },

        // TODO: Remove after finishing testing.
        '2': {
          id: 2,
          name: 'Write seed data',
          start: '2017-10-21T00:00:00.000Z',
          end: '2017-10-21T00:20:00.000Z',
          is_complete: true,
          duration:1200,
          session_id: 1,
          category_id: 1
        },
      },
    },

    category: {
      entities: {},
    },
  },

  // Contains pointers to the currently rendered or selected object.
  current: {
    user: undefined,

    // TODO: Remove after finishing testing.
    session: 1,
    activity: undefined,
    category: undefined,
  },

  // Contains items that need to be ordered in some way, such as a Session's activities
  // or sessions.
  ordered: {

    // Each property is a Session ID and the value will be an array
    // ordered by `startTime` of that session's activities.
    sessionActivities: {},

    sessions: {
      entries: [],
    },
  },
};