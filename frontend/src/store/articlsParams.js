export default {
  namespaced: true,
  state: () => ({
    allTypes: [
      "Review (OA)",
      "Review (PA)",
      "Research (OA)",
      "Research (PA)",
      "Images",
      "Presentations",
      "Videos",
      "Web",
    ],
    text: "",
    authors: "",
    comparison: "after",
    yearComparisons: ["after", "before", "exactly"],
    journal: "",
    paramsCurrent: {
    },
    title: "",
    types: [],
    year: 1944,
    yearComparison: "after",
    years: [],
    yearsStart: 1944,
  }),
  mutations: {
    SET_TEXT: (state, payload) => {
      state.text = payload;
    },
    SET_AUTHORS: (state, payload) => {
      state.authors = payload;
    },
    SET_JOURNAL: (state, payload) => {
      state.journal = payload;
    },
    SET_TYPES: (state, payload) => {
      state.types = payload;
    },
    SET_TITLE: (state, payload) => {
      state.title = payload;
    },
    SET_YEAR: (state, payload) => {
      state.year = payload;
    },
    SET_YEAR_COMPARISON: (state, payload) => {
      state.yearComparison = payload;
    },
  },
  actions: {
    text: (context, payload) => {
      context.commit("SET_TEXT", payload);
    },
    authors: (context, payload) => {
      context.commit("SET_AUTHORS", payload);
    },
    journal: (context, payload) => {
      context.commit("SET_JOURNAL", payload);
    },
    title: (context, payload) => {
      context.commit("SET_TITLE", payload);
    },
    types: (context, payload) => {
      context.commit("SET_TYPES", payload.slice());
    },
    year: ({
      commit, state,
    }, payload) => {
      if (payload === state.yearsStart) {
        commit("SET_YEAR_COMPARISON", payload);
      }

      commit("SET_YEAR", payload);
    },
    yearComparison: (context, payload) => {
      context.commit("SET_YEAR_COMPARISON", payload);
    },
    reset: ({
      commit,
    }, _ = undefined) => {
      commit("SET_TEXT", _);

      commit("SET_AUTHORS", _);

      commit("SET_JOURNAL", _);

      commit("SET_TITLE", _);

      commit("SET_TYPES", []);

      commit("SET_YEAR_COMPARISON", _);

      commit("SET_YEAR", _);
    },
  },
  getters: {
    text: (state) => state.text,
    title: (state) => state.title,
    allTypes: (state) => state.allTypes,
    authors: (state) => state.authors,

    journal: (state) => state.journal,
    paramsCurrent: (state) => state.paramsCurrent,
    types: (state) => state.types,
    year: (state) => state.year,
    yearComparison: (state) => state.yearComparison,
    yearComparisons: (state) => state.yearComparisons,
    years: (state) => [...Array(new Date().getUTCFullYear() - (state.yearsStart - 1)).keys()]
      .map((x) => state.yearsStart + x + 1)
      .reverse(),
    yearsStart: (state) => state.yearsStart,
    params: (state) => ({
      ...(state.text && {
        text: state.text,
      }),
      ...(state.title && {
        title: state.title,
      }),
      ...(state.journal && {
        journal: state.journal,
      }),
      ...(state.authors && {
        authors: state.authors,
      }),
      ...(Number(state.year) !== Number(state.yearsStart) && {
        yearComparison: state.yearComparison,
        year: state.year,
      }),
      ...(state.types
          && state.types.length !== state.allTypes.length && {
        types: state.types,
      }),
      ...(state.page && Number(state.page) !== 1 && {
        page: state.page,
      }),
      ...(state.limit && Number(state.limit) !== 5 && {
        limit: state.limit,
      }),
    }),
  },
};
