export default {
  namespaced: true,

  state: () => ({
    errorMessage: undefined,
    errorStack: undefined,
    okFunction: undefined,
  }),

  mutations: {


    SET_ERROR_MESSAGE: (state, payload) => {
      state.errorMessage = payload;
    },

    SET_ERROR_STACK: (state, payload) => {
      state.errorStack = payload;
    },
  },

  actions: {
    setError: (context, payload) => {
      let errorMessage = payload;
      let errorStack = "";
      if (payload?.data?.message) {
        errorMessage = payload.response.data.message;
      }

      if (payload?.data?.stack) {
        errorStack = payload.response.data.stack;
      }
      if (payload?.data?.message) {
        errorMessage = payload.response.data.message;
      }

      if (payload?.response?.data?.stack) {
        errorStack = payload.response.data.stack;
      }

      context.commit("SET_ERROR_MESSAGE", errorMessage);

      context.commit("SET_ERROR_STACK", errorStack);
    },

    clearError: (context) => {
      context.commit("SET_ERROR_MESSAGE", "");

      context.commit("SET_ERROR_STACK", "");
    },
  },

  getters: {
    errorMessage: (state) => state.errorMessage,

    errorStack: (state) => state.errorStack,
  },
};
