<template>
  <header>
    <article>
      <nav>
        <ul>
          <li class="brand">
            <router-link to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 112.8 103.84"
              >
                <path
                  class="a"
                  d="M52.8,87.77c-18.8-5.2-28.1-26-19.5-48a17.71,17.71,0,0,1,.8-1.9A52.8,52.8,0,0,0,24,54.27c-8.6,22-1.3,43.2,17.5,48.4,18.3,5.1,40.7-6.8,49.8-27.7C80.5,86.87,66.32,91.47,52.8,87.77Z"
                />
                <path
                  class="a"
                  d="M97.1,95.38a13.88,13.88,0,0,1-3.2-4.9,9.62,9.62,0,0,1-1-4.8c0-2.5.3-11.2,1.6-26.1a194.84,194.84,0,0,0,.5-24.4c-.9-9.1-4.2-24.9-21.7-31.9-20-8-36.6.4-43.3,6.6-7.9,7.3-12.2,11-29.2,18.3a7.46,7.46,0,0,1-.8.4c19-3.9,25.8-5.5,48.6-5.5,8.3,0,16.5,2.5,21.9,7.1,4.5,3.8,6.8,13.6,7.1,19.5s.3,39.2.3,39.2c.2,4.4,2.4,7.8,6.6,10.3a33,33,0,0,0,16.8,4.4,43,43,0,0,0,11.5-1.6A24.54,24.54,0,0,1,97.1,95.38ZM37.4,17.28a2.5,2.5,0,1,1,2.5-2.5,2.48,2.48,0,0,1-2.44,2.5H37.4Z"
                />
              </svg>
            </router-link>
          </li>
          <li>
            <router-link to="/">
              Articl.net <span v-if="articlCount">{{ countMessage }}</span>
            </router-link>
          </li>
        </ul>

        <ul class="right">
          <li>
            <vue-feather
              size="2rem"
              type="search"
              role="searchbox"
              aria-label="Search"
            />
            <!-- <router-link
              :to="{ name: 'SearchArticls' }"
              class="search-articls"></router-link> -->
          </li>

          <li v-if="!isLoggedInMixin && $route.name !== 'LoginPage'">
            <router-link :to="{ name: 'LoginPage' }">
              <button class="bright-button">
                Log In or Create Account
                <vue-feather size=" 1rem" type="log-in" aria-label="User" />
              </button>
            </router-link>
          </li>

          <li v-else-if="$route.name !== 'LoginPage'">
            <details role="list">
              <summary aria-haspopup="listbox">
                <div role="link">
                  <span class="sr">User</span>
                  <vue-feather size="2rem" type="user" aria-label="User" />
                </div>
              </summary>

              <ul role="listbox">
                <li>
                  <label for="theme">
                    <input
                      id="theme"
                      type="checkbox"
                      name="theme"
                      role="switch"
                      :checked="theme === 'dark'"
                      :aria-checked="theme === 'dark'"
                      @click="toggleTheme()"
                    />
                    {{ theme }}</label
                  >
                </li>

                <li>
                  <div class="grid">
                    <div>
                      <a
                        class="less-margin"
                        href="#"
                        @click.prevent="changeTextSize(0.85)"
                        @keyup.enter="changeTextSize(0.85)"
                      >
                        <vue-feather
                          size="0.6rem"
                          type="type"
                          aria-label="Small text"
                        /><span class="sr">Small text</span>
                      </a>
                    </div>

                    <div>
                      <a
                        class="less-margin"
                        href="#"
                        @click.prevent="changeTextSize(1)"
                        @keyup.enter="changeTextSize(1)"
                      >
                        <vue-feather
                          size="0.8rem"
                          type="type"
                          aria-label="Normal text"
                        /><span class="sr">Normal text</span>
                      </a>
                    </div>

                    <div>
                      <a
                        class="less-margin"
                        href="#"
                        @click.prevent="changeTextSize(1.15)"
                        @keyup.enter="changeTextSize(1.15)"
                      >
                        <vue-feather
                          size="1rem"
                          type="type"
                          aria-label="Large text"
                        /><span class="sr">Large text</span>
                      </a>
                    </div>
                  </div>
                </li>
                <li>
                  <router-link class="less-margin" to="/users/me">
                    Edit profile
                  </router-link>
                </li>
                <li>
                  <a href="#" class="less-margin" @click.prevent="logout"
                    >Log out</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="less-margin"
                    @click.prevent="clearLocalData"
                    >For development: clear data</a
                  >
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </nav>
    </article>
  </header>
</template>

<script>
import VueCookies from "vue-cookies";
import VueFeather from "vue-feather";
import { mapGetters } from "vuex";

import axiosInstance from "~/services/axiosService";

export default {
  name: "TheHeader",
  components: {
    VueFeather,
  },
  data: () => ({
    theme: "",
  }),
  computed: {
    ...mapGetters({
      articlCount: "resources/count",
      accessTokenExpires: "tokens/accessTokenExpires",
      lastPath: "resources/lastPath",
    }),
    countMessage() {
      return `${this.articlCount} articles`;
    },
  },
  created() {
    const theme = VueCookies.get("data-theme");

    this.theme = theme !== "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", this.theme);

    if (VueCookies.isKey("font-size-factor")) {
      this.changeTextSize(VueCookies.get("font-size-factor"));
    } else {
      this.changeTextSize(1);
    }
  },
  methods: {
    async toggleTheme() {
      try {
        this.theme = this.theme === "light" ? "dark" : "light";

        document.documentElement.setAttribute("data-theme", this.theme);

        VueCookies.set("data-theme", this.theme);

        await axiosInstance({
          method: "PATCH",
          url: "/users/me",
          data: {
            theme: this.theme,
            fontSize: this.fontSize,
          },
        });
      } catch (error) {
        this.$store.dispatch("errors/setError", error);
      }
    },
    async logout() {
      await this.$store.dispatch("users/logout");
    },
    getDefaultProperty(tag, prop) {
      const elem = document.createElement(tag);
      document.body.appendChild(elem);
      const defaultStyles = { ...window.getComputedStyle(elem) };
      document.body.removeChild(elem);
      return defaultStyles[prop];
    },
    changeTextSize(factor) {
      const pixelSize =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--font-size"
          )
        ) || 16;
      const sizeFactor =
        factor === 1 ? 1 : factor * (VueCookies.get("font-size-factor") || 1);
      const newSize = sizeFactor * pixelSize;
      document.documentElement.style.setProperty("--font-size", `${newSize}px`);
      VueCookies.set("font-size-factor", sizeFactor);
    },
    clearLocalData() {
      this.$store.dispatch("tokens/clearTokens", false);
      VueCookies.remove("data-theme");
      VueCookies.remove("font-size");
    },
  },
};
</script>

<style scoped lang="scss">
details[role="list"],
details summary,
details[role="list"] summary:not([role]):focus {
  padding: 0 !important;
  border: 0 !important;
  box-shadow: none !important;
}

details summary::after {
  display: none !important;
}

svg {
  width: 2rem;
  height: 2rem;
}

li .grid {
  text-align: left;
}

.less-margin {
  padding: 0;
  margin: 0;
}

.a {
  fill: var(--primary);
}

.search-articls {
  margin-right: 1rem;
}

.nav-user a {
  width: 5rem;
}

.nav-user {
  margin: 0 1rem;
}
</style>
