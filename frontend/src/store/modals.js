export default {
  namespaced: true,
  state: () => ({
    successMessage: undefined,
    successTitle: undefined,
    errorMessage: undefined,
    errorTitle: undefined,
  }),
  mutations: {
    SET_SUCCESS_TITLE: (state, payload) => {
      state.successTitle = payload;
    },
    SET_SUCCESS_MESSAGE: (state, payload) => {
      state.successMessage = payload;
    },
    SET_ERROR_TITLE: (state, payload) => {
      state.errorTitle = payload;
    },
    SET_ERROR_MESSAGE: (state, payload) => {
      state.errorMessage = payload;
    },
  },
  actions: {
    setSuccessTitle: (context, payload) => {
      context.commit("SET_SUCCESS_TITLE", payload);
    },
    setSuccessMessage: (context, payload) => {
      context.commit("SET_SUCCESS_MESSAGE", payload);
    },
    clearSuccess: (context) => {
      context.commit("SET_SUCCESS_TITLE", "");

      context.commit("SET_SUCCESS_MESSAGE", "");
    },
    setErrorMessage: (context, payload) => {
      context.commit("SET_ERROR_MESSAGE", payload);
    },
    clearError: (context) => {
      context.commit("SET_ERROR_TITLE", "");

      context.commit("SET_ERROR_MESSAGE", "");
    },
  },
  getters: {
    successMessage: (state) => state.successMessage,
    successTitle: (state) => state.successTitle,
    errorMessage: (state) => state.errorMessage,
    errorTitle: (state) => state.errorTitle,
  },
};
