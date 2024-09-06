<template>
  <article>
    <h1>Change Password</h1>
    <form v-if="!success">
      <label for="password"
        >Current Password
        <div class="toggle-password">
          <input
            id="oldPassword"
            v-model="oldPassword"
            name="oldPassword"
            :type="oldPasswordType"
            autocomplete="current-password"
          /><the-button-toggle-hidden
            class="toggle-password-mask"
            @show="
              oldPasswordType = oldPasswordType === 'text' ? 'password' : 'text'
            "
          />
        </div>
      </label>

      <label v-if="!isLoggedInMixin" for="password"
        >Password
        <small v-if="passwordInvalid" class="left-space">
          Must be 12 or more characters using characters from at least two of
          these groups: uppercase letters, lowercase letters, digits and special
          characters.
        </small>

        <div class="toggle-password">
          <input
            id="password"
            v-model="password"
            :type="passwordType"
            :aria-invalid="passwordInvalid"
            maxlen="64"
            name="password"
            autocomplete="new-password"
            @blur="elementBlurred"
          />
          <the-button-toggle-hidden
            class="toggle-password-mask"
            @show="passwordType = passwordType === 'text' ? 'password' : 'text'"
          />
        </div>
      </label>
      <label v-if="!isLoggedInMixin" for="password2"
        >Confirm password
        <div class="toggle-password">
          <input
            id="password2"
            v-model="password2"
            :type="password2Type"
            maxlen="64"
            name="password2"
            :aria-invalid="password2Invalid"
            autocomplete="new-password"
            @blur="elementBlurred"
          />
          <the-button-toggle-hidden
            class="toggle-password-mask"
            @show="
              password2Type = password2Type === 'text' ? 'password' : 'text'
            "
          />
        </div>
      </label>

      <input
        type="hidden"
        name="username"
        v-model="username"
        autocomplete="username"
      />
      <button
        id="reset"
        type="submit"
        :aria-busy="buttonDisabled"
        @click.prevent="submitForm()"
      >
        <span v-if="!buttonDisabled">Change Password</span>
      </button>
      <p v-if="result" class="invalid">
        {{ result }}
      </p>
    </form>
    <p v-else class="valid">
      You have successfully changed your password. Please
      <router-link :to="{ name: 'LoginPage' }"
        >sign in with your new password</router-link
      >.
    </p>
  </article>
</template>

<script>
import { mapGetters } from "vuex";
import theButtonToggleHidden from "~/components/ui/TheButtonToggleHidden.vue";
import { scoreChars } from "~/services/userService";
import axiosInstance from "~/services/axiosService";

export default {
  name: "ChangePasswordLoggedIn",
  components: {
    theButtonToggleHidden,
  },
  data: () => ({
    oldPassword: null,
    newPassword: null,
    newPassword2: null,
    oldPasswordType: "password",
    newPasswordType: "password",
    newPassword2Type: "password",
    buttonDisabled: false,
    passwordComplexity: 0,
    errorMessage: "",
    success: false,
    result: null,
    chrs: 0,
    username: "",
  }),
  computed: {
    ...mapGetters({
      user: "users/user",
      tokens: "tokens/tokens",
    }),
  },
  watch: {
    newPassword: {
      handler(val) {
        this.passwordComplexity = scoreChars(val);
      },
    },
  },
  created() {
    this.username = this.user.username;
    this.setTitleAndDescriptionMixin({
      titleHtml: "Change Password",
    });
  },
  methods: {
    checkForm() {
      let passed = true;

      if (this.newPassword?.length < 8) {
        this.errorMessage = "Passwords are at least eight characters.";
        passed = false;
      } else if (this.newPassword !== this.newPassword2) {
        this.errorMessage = "Passwords do not mach.";
        passed = false;
      } else if (!this.tokens?.accessTokenValue) {
        this.errorMessage = "You are must be logged in to use this form.";
        passed = false;
      }

      return passed;
    },

    resetFormErrors() {
      this.success = null;

      this.result = null;
    },

    async submitForm() {
      try {
        if (this.checkForm() === true) {
          this.buttonDisabled = true;

          await axiosInstance({
            method: "POST",
            url: "/auth/change-password-logged-in",
            data: {
              token: this.tokens?.accessTokenValue,
              oldPassword: this.oldPassword,
              password: this.newPassword,
              password2: this.newPassword2,
            },
          });

          this.$store.dispatch("modals/setSuccessTitle", "Password updated");

          this.$store.dispatch(
            "modals/setSuccessMessage",
            "You have successfully changed your password."
          );

          this.success = true;
        } else {
          this.$store.dispatch("errors/setError", this.errorMessage);
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
