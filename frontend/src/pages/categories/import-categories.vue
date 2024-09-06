<template>
  <article>
    <h1 v-if="!success">Import categories</h1>
    <h1 v-else>Categories imported</h1>
    <form v-if="!success">
      <button
        id="Login"
        type="submit"
        :aria-busy="buttonDisabled"
        @click.prevent="submitForm()"
      >
        Start
      </button>
      <pre>{{ result }}</pre>
    </form>
  </article>
</template>

<script>
import axiosInstance from "~/services/axiosService";

export default {
  name: "ImportCategoriesPage",
  data: () => ({
    buttonDisabled: false,
    success: false,
    result: null,
    chrs: 0,
  }),
  methods: {
    async submitForm() {
      this.buttonDisabled = true;

      const result = await axiosInstance({
        method: "POST",
        url: "/categories/import-categories",
      });

      this.success = true;
      this.result = result.data;
      this.buttonDisabled = false;
    },
  },
};
</script>

<style scoped>
*[readonly] {
  cursor: not-allowed;
}
</style>
