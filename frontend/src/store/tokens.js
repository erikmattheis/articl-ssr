import {
  clearJWTTokens,
  getJWTToken,
  setJWTTokens,
  refreshJWTSession,
} from "~/services/tokensService";

export default {
  namespaced: true,

  state: () => ({
    accessTokenExpires: getJWTToken("accessTokenExpires"),
    accessTokenValue: getJWTToken("accessTokenValue"),
    refreshTokenExpires: getJWTToken("refreshTokenExpires"),
    refreshTokenValue: getJWTToken("refreshTokenValue"),
  }),

  mutations: {
    SET_ACCESS_TOKEN_VALUE: (state, payload) => {
      state.accessTokenValue = payload;
    },

    SET_ACCESS_TOKEN_EXPIRES: (state, payload) => {
      state.accessTokenExpires = payload;
    },

    SET_REFRESH_TOKEN_VALUE: (state, payload) => {
      state.refreshTokenValue = payload;
    },

    SET_REFRESH_TOKEN_EXPIRES: (state, payload) => {
      state.refreshTokenExpires = payload;
    },
  },

  actions: {
    setTokens: (context, payload) => {
      context.commit("SET_ACCESS_TOKEN_EXPIRES", payload.access.expires);
      context.commit("SET_ACCESS_TOKEN_VALUE", payload.access.token);
      context.commit("SET_REFRESH_TOKEN_EXPIRES", payload.refresh.expires);
      context.commit("SET_REFRESH_TOKEN_VALUE", payload.refresh.token);
      setJWTTokens(payload);
    },
    clearTokens: (context, payload) => {
      context.commit("SET_ACCESS_TOKEN_EXPIRES", "");
      context.commit("SET_ACCESS_TOKEN_VALUE", "");
      context.commit("SET_REFRESH_TOKEN_EXPIRES", "");
      context.commit("SET_REFRESH_TOKEN_VALUE", "");
      clearJWTTokens(payload.rememberMe);
    },
    accessTokenExpires: (context, payload) => {
      context.commit("SET_ACCESS_TOKEN_EXPIRES", payload);
    },

    accessTokenValue: (context, payload) => {
      context.commit("SET_ACCESS_TOKEN_VALUE", payload);
    },

    refreshTokenExpires: (context, payload) => {
      context.commit("SET_REFRESH_TOKEN_EXPIRES", payload);
    },

    refreshTokenValue: (context, payload) => {
      context.commit("SET_REFRESH_TOKEN_VALUE", payload);
    },

    async refreshSession({ state }) {
      try {
        const { refreshTokenValue } = state;
        const tokens = await refreshJWTSession(refreshTokenValue);

        if (tokens) {
          setJWTTokens(tokens);
          return true;
        } else {
          // Token refresh was unsuccessful, handle the error here
          console.error("Token refresh failed.");
          return false;
        }
      } catch (error) {
        // Handle any errors that occur during the refresh process
        console.error("An error occurred during token refresh:", error);
        return false;
      }
    },
  },

  getters: {
    tokens: (state) => ({
      accessTokenExpires: state.accessTokenExpires,
      accessTokenValue: state.accessTokenValue,
      refreshTokenExpires: state.refreshTokenExpires,
      refreshTokenValue: state.refreshTokenValue,
    }),

    accessTokenExpires: (state) => state.accessTokenExpires,

    accessTokenValue: (state) => state.accessTokenValue,

    refreshTokenExpires: (state) => state.refreshTokenExpires,

    refreshTokenValue: (state) => state.refreshTokenValue,
  },
};
