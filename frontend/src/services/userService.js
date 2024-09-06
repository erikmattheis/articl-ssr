import VueCookies from "vue-cookies";
import axiosInstance from "~/services/axiosService";

const charCounts = (val) => ({
  numUpper: val.length - val.replace(/[A-Z]/g, "").length,
  numLower: val.length - val.replace(/[a-z]/g, "").length,
  numDigit: val.length - val.replace(/d/g, "").length,
  numSpecial: val.length - val.replace(/\W|_/g, "").length,
});

const scoreChars = (val) => {
  if (!val) {
    return 0;
  }

  const chars = charCounts(val);
  const a = chars.numUpper > 0 ? 1 : 0;
  const b = chars.numLower > 0 ? 1 : 0;
  const c = chars.numDigit > 0 ? 1 : 0;
  const d = chars.numSpecial > 0 ? 1 : 0;

  return a + b + c + d;
};

const validateEmail = (email) => {
  if (!email) {
    return false;
  }
  return email.match(
    // eslint-disable-next-line
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const login = async ({ username, password }) => {
  try {
    const result = await axiosInstance.post("/auth/login", {
      username,
      password,
    });
    setSuccessfulLoginCookies(result?.data?.tokens);
    setSuccessfulLoginUser(result?.data?.user);
    return result;
  } catch (error) {
    console.log("error from server:", error);
    throw Error(error);
  }
};

const setSuccessfulLoginCookies = (tokens) => {
  if (!tokens) {
    return;
  }
  VueCookies.set("accessTokenExpires", tokens.accessTokenExpires);
  VueCookies.set("accessTokenValue", tokens.accessTokenValue);
  VueCookies.set("refreshTokenExpires", tokens.refreshTokenExpires);
  VueCookies.set("refreshTokenValue", tokens.refreshTokenValue);
};

const setSuccessfulLoginUser = (user) => {
  VueCookies.set("user", user);
};

const logout = async ({ accessToken }) => {
  try {
    await axiosInstance.post("/auth/logout", { accessToken });
    VueCookies.remove("accessTokenExpires");
    VueCookies.remove("accessTokenValue");
    VueCookies.remove("refreshTokenExpires");
    VueCookies.remove("refreshTokenValue");
  } catch (error) {
    if (error.response && error.response.data.message === "Token not found") {
      // Display an error message to the user
      throw new Error("Token not found during logout:", error || "Unknown");
      // Optionally, you can redirect the user to the login page or display a user-friendly error message on the front end.
    } else {
      // Handle other errors
      throw new Error("Logout error:", error || "Unknown");
      // Display a user-friendly error message or take appropriate actions based on the error.
    }
  }
};

export { scoreChars, validateEmail, login, logout };
