<template>
  <article>
    <h1>Change Password</h1>
    <form v-if="!success">
      <label for="newPassword"
        >New password
        <small v-if="passwordComplexity < 3" class="lighter left-space">
          Use upper- and lowercase, numerical and special characters.
        </small>
        <small v-else-if="newPassword.length < 8" class="lighter left-space">
          Please use 8 or more characters.
        </small>
        <div class="toggle-password">
          <input
            id="newPassword"
            v-model="newPassword"
            :type="newPasswordType"
            autocomplete="new-password"
          />
          <the-button-toggle-hidden
            class="toggle-password-mask"
            @show="
              newPasswordType = newPasswordType === 'text' ? 'password' : 'text'
            "
          />
        </div>
      </label>
      <label for="newPassword2"
        >Confirm new new password
        <div class="toggle-password">
          <input
            id="newPassword2"
            v-model="newPassword2"
            :type="newPassword2Type"
            autocomplete="new-password"
          />
          <the-button-toggle-hidden
            class="toggle-password-mask"
            @show="
              newPassword2Type =
                newPassword2Type === 'text' ? 'password' : 'text'
            "
          />
        </div>
      </label>
      <input type="hidden" name="username" v-model="username" />
      <button
        id="reset"
        type="submit"
        :aria-busy="buttonDisabled"
        @click.prevent="submitForm()"
      >
        <span v-if="!buttonDisabled">Change Password</span>
      </button>
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
  name: "ChangePasswordEmail",
  components: {
    theButtonToggleHidden,
  },
  data: () => ({
    newPassword: null,
    newPassword2: null,
    passwordType: "password",
    newPasswordType: "password",
    newPassword2Type: "password",
    buttonDisabled: false,
    passwordComplexity: 0,
    errorMessage: "",
    success: false,
    chrs: 0,
    username: "",
  }),
  computed: {
    ...mapGetters({ user: "users/user" }),
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

          const result = await axiosInstance({
            method: "POST",
            url: "/auth/change-password-email",
            data: {
              token: this.$route.query.token,
              password: this.newPassword,
              password2: this.newPassword2,
            },
          });

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
