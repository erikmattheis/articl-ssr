import VueCookies from "vue-cookies";
import axiosInstance from "~/services/axiosService";

const clearJWTTokens = (rememberMe) => {
  VueCookies.remove("accessTokenValue");
  VueCookies.remove("accessTokenExpires");

  if (!rememberMe) {
    VueCookies.remove("refreshTokenValue");
    VueCookies.remove("refreshTokenExpires");
  }
};

const getJWTToken = (key) => VueCookies.get(key);

const setJWTToken = (key, value) => VueCookies.set(key, value);

const setJWTTokens = (tokens) => {
  VueCookies.set("accessTokenValue", tokens.access?.token);
  VueCookies.set("accessTokenExpires", tokens.access?.expires);
  VueCookies.set("refreshTokenValue", tokens.refresh?.token);
  VueCookies.set("refreshTokenExpires", tokens.refresh?.expires);
};

const refreshJWTSession = async (refreshTokenValue) => {
  const result = await axiosInstance({
    method: "POST",
    url: "/auth/refresh-tokens",
    data: {
      refreshToken: refreshTokenValue,
    },
  });
  return result.data;
};

export {
  getJWTToken,
  clearJWTTokens,
  setJWTToken,
  setJWTTokens,
  refreshJWTSession,
};
