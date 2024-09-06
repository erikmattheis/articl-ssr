<template>
  <article>
    <h1>{{ resultTitle }}</h1>
    <p v-if="resultTitle">Please <a href="/login">log in</a> to continue.</p>
  </article>
</template>

<script>
import axiosInstance from "~/services/axiosService";

export default {
  name: "VerifyEmailPage",

  data: () => ({
    resultTitle: null,
    result: null,
  }),
  async mounted() {
    try {
      await this.submitForm();

      this.setTitleAndDescriptionMixin({
        titleHtml: "Email Verification",
      });
    } catch (error) {
      this.$store.dispatch("errors/setError", error);

      this.setTitleAndDescriptionMixin({
        titleHtml: "Email Verification Failed.",
      });
    }
  },
  methods: {
    async submitForm() {
      this.isLoading = true;

      const response = await axiosInstance({
        method: "GET",
        url: `/auth/verify-email?token=${this.$route.query.token}`,
      });

      if (response?.status === 204) {
        this.resultTitle = "Email verified";
      } else {
        this.$store.dispatch("errors/setError", response);
      }

      this.isLoading = false;
    },
  },
};
</script>
