<template>
  <article>
    <h1>Log in</h1>
    <form>
      <p class="error invalid" v-if="logInError">
        {{ logInError }}
      </p>
      <label for="username"
        >User Name
        <input
          id="username"
          v-model="username"
          name="username"
          type="text"
          autocomplete="username"
      /></label>
      <label for="password"
        >Password
        <div class="toggle-password">
          <input
            id="password"
            v-model="password"
            name="password"
            :type="passwordType"
            autocomplete="current-password"
          /><the-button-toggle-hidden
            class="toggle-password-mask"
            @show="passwordType = passwordType === 'text' ? 'password' : 'text'"
          />
        </div>
      </label>
      <button
        id="Login"
        :aria-busy="buttonDisabled"
        @click.prevent="submitForm()"
      >
        <span v-if="!buttonDisabled">Login</span>
      </button>
    </form>
    Forgot
    <router-link to="/send-change-password-email"> password </router-link>
    or
    <router-link to="/forgot-username"> username </router-link>
    <router-link to="/users" class="right"> Create account </router-link>
  </article>
</template>

<script>
import { mapGetters } from "vuex";
import theButtonToggleHidden from "~/components/ui/TheButtonToggleHidden.vue";

export default {
  name: "LoginPage",
  components: {
    theButtonToggleHidden,
  },
  data: () => ({
    username: null,
    usernameInvalid: null,
    password: null,
    passwordInvalid: null,
    showPassword: false,
    buttonDisabled: false,
    passwordType: "password",
    errorMessage: "",
  }),
  computed: {
    ...mapGetters({
      user: "users/user",
      tokens: "tokens/tokens",
      lastPath: "resources/lastPath",
      logInError: "users/logInError",
    }),
  },
  mounted() {
    this.setTitleAndDescriptionMixin({
      titleHtml: "Articl Login",
    });
  },
  onBeforeUnmount() {
    this.$store.dispatch("users/clearLogInError");
  },
  methods: {
    resetFormErrors() {
      this.errorMessage = "";
      this.$store.dispatch("users/clearLogInError");
    },
    checkForm() {
      let passed = true;

      if (!this.username) {
        this.errorMessage = "Please enter your username.";

        passed = false;
      }

      if (!this.password) {
        this.errorMessage = "Please enter your password.";

        passed = false;
      }

      return passed;
    },

    async submitForm() {
      try {
        if (this.checkForm() === true) {
          this.buttonDisabled = true;

          const user = await this.$store.dispatch("users/login", {
            password: this.password,
            username: this.username,
          });
          console.log("user", user);
          if (!user) {
            return false;
          }

          this.resetFormErrors();

          const theme = this.user?.theme !== "dark" ? "light" : "dark";

          this.$cookies.set("data-theme", theme);

          document.documentElement.setAttribute("data-theme", theme);

          const fontSize = this.user?.fontSize ? this.user?.fontSize : 16;

          this.$cookies.set("font-size", fontSize);

          const redirectTo = this.lastPath || "/";
          this.$router.push(redirectTo);
        }
      } catch (error) {
        this.$store.dispatch("errors/setError", error);
      } finally {
        this.buttonDisabled = false;
      }
    },
  },
};
</script>
