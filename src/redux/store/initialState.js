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
    session: undefined,
    activityInstance: undefined,
    category: undefined,
  },

  app: {
    user: {
      props: {
        id: 'cb39dbb5-caa8-4323-93a5-13450b875887',
      },
      fetchStatus: '',
    },
    screenState: {
      AddActivityModal: {
        isOpen: false,
      },

      // TODO: Remove when done with testing.
      liveActivityInstanceId: 'f36c74b2-c798-4d8f-a8cb-d353ee3b2c44',
    },
  },
};