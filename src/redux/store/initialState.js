export default {
  entities: {
    user: {
      entities: {},
    },

    session: {
      entities: {},
    },

    activity: {
      entities: {},
    },

    category: {
      entities: {},
    },
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