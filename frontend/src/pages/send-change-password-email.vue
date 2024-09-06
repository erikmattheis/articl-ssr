<template>
  <article>
    <h1>Change Password Using Email</h1>
    <form v-if="!success">
      <label for="email"
        >Email
        <input
          id="email"
          v-model="email"
          name="email"
          type="text"
          autocomplete="email"
      /></label>
      <button
        id="reset"
        type="submit"
        :aria-busy="buttonDisabled"
        @click.prevent="submitForm()"
      >
        <span v-if="!buttonDisabled">Send Email</span>
      </button>
    </form>
    <p v-else>
      An email has been sent to {{ email }} with instructions on how to reset
      your password.
    </p>
  </article>
</template>

<script>
import validateEmail from "~/services/emailValidationService";
import axiosInstance from "~/services/axiosService";

export default {
  name: "SendChangePassEmail",
  data: () => ({
    email: null,
    emailInvalid: null,
    errorMessage: "",
    buttonDisabled: false,
    success: null,
  }),
  mounted() {
    this.setTitleAndDescriptionMixin({
      titleHtml: "Change Password via Email Link",
    });
  },
  methods: {
    resetForm() {
      this.emailInvalid = null;
    },
    checkForm() {
      if (!this.email || !validateEmail.validateEmail(this.email)) {
        this.errorMessage = "Please enter a valid email address";

        return false;
      }

      return true;
    },
    async submitForm() {
      try {
        this.resetForm();

        if (this.checkForm() === true) {
          this.buttonDisabled = true;

          await axiosInstance({
            method: "POST",
            url: "/auth/send-change-password-email",
            data: {
              email: this.email,
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
