export default {
  entities: {
    session: {
      entities: {},
      fetchStatus: {},
      new: {
        fetchStatus: '',
      },
    },

    activityType: {
      entities: {},
      fetchStatus: {},
      new: {
        fetchStatus: '',
      },
    },

    activityInstance: {
      entities: {},
      fetchStatus: {},
      new: {
        fetchStatus: '',
      },
    },

    category: {
      entities: {},
      fetchStatus: {},
      new: {
        fetchStatus: '',
      },
    },
  },

  // Contains pointers to the currently rendered or selected object.
  current: {

    // TODO: Remove after finishing testing.
    session: 1,
    activityInstance: undefined,
    category: undefined,
  },

  app: {
    user: {
      props: {},
      fetchStatus: '',
    },
  },
};