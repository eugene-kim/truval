export default {
  entities: {
    user: {
      entities: {},
    },

    session: {
      entities: {},
    },

    activityType: {
      entities: {},
    },

    activityInstance: {
      entities: {},
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
    activityInstance: undefined,
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