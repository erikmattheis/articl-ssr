import { createSSRApp } from "vue";
import VueCookies from "vue-cookies";

import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import isLoggedInMixin from "./mixins/isLoggedInMixin";
import setTitleAndDescriptionMixin from "./mixins/setTitleAndDescriptionMixin";
import axiosInstance from "./services/axiosService";

import "~/assets/global.scss";

const app = createSSRApp(App);

app.use(router);
app.use(store);
app.use(VueCookies);
app.mixin(isLoggedInMixin);
app.mixin(setTitleAndDescriptionMixin);
app.config.globalProperties.$axios = axiosInstance;

let secure = true;

if (
  window.location.hostname === "192.168.1.130" ||
  window.location.hostname === "localhost"
) {
  secure = false;
}

app.mount("#app");
