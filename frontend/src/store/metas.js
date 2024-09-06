export default {
  namespaced: true,
  state: () => ({
    description: undefined,
    title: undefined,
  }),
  mutations: {
    SET_DOCUMENT_TITLE: (state, payload) => {
      state.title = payload;
    },
    SET_META_DESCRIPTION: (state, payload) => {
      state.description = payload;
    },
  },
  actions: {
    setMetaDescriptionAndDocumentTitle: (context, {
      title, description,
    }) => {
      context.commit("SET_DOCUMENT_TITLE", title);

      context.commit("SET_META_DESCRIPTION", description);
    },
  },
  getters: {
    title: (state) => state.title,
    description: (state) => state.description,
  },
};
