<template>
  <article v-if="!deleted">
    <h1>Delete Articl</h1>
    <p>Really delete the articl "{{ title }}"?</p>
    <form>
      <button
        :aria-busy="buttonDisabled"
        @click.prevent="
          $router.push({ name: 'ArticlsList', params: { slug, articlType } })
        "
      >
        Cancel
      </button>
      <button :aria-busy="buttonDisabled" @click.prevent="deleteArticl()">
        Delete
      </button>
    </form>
  </article>
  <article v-else>
    <h1>Articl Deleted</h1>
    <a
      tabindex="0"
      href
      @click.prevent="
        $router.push({ name: 'ArticlsList', params: { slug, articlType } })
      "
      @keyup.enter.prevent="
        $router.push({ name: 'ArticlsList', params: { slug, articlType } })
      "
      >Return to Category Page
    </a>
  </article>
</template>

<script>
import axiosInstance from "~/services/axiosService";

export default {
  name: "DeleteArticlPage",
  data: () => ({
    buttonDisabled: false,
    deleted: false,
    id: "X",
    slug: "",
    articlType: "",
    title: "",
  }),
  async mounted() {
    this.id = this.$route.params.id;
    this.slug = this.$route.params.slug;
    this.articlType = this.$route.params.articlType;

    await this.getCurrentArticl(this.id);

    this.setTitleAndDescriptionMixin({
      titleHtml: `Delete Articl "${this.title}"`,
    });
  },
  methods: {
    async deleteArticl() {
      try {
        this.buttonDisabled = true;

        await this.submitDelete(this.id);

        this.deleted = true;

        this.setTitleAndDescriptionMixin({
          titleHtml: "Articl Deleted",
        });

        this.$store.dispatch("modals/setSuccessTitle", "Deletion successful.");

        this.$store.dispatch(
          "modals/setSuccessMessage",
          `The articl "${this.title}" has been permanently deleted.`
        );
      } catch (error) {
        this.$store.dispatch("errors/setError", error);
      } finally {
        this.buttonDisabled = false;
      }
    },
    async getArticl(id) {
      return axiosInstance({
        method: "GET",
        url: `/articls/${id}`,
      });
    },

    async getCurrentArticl(id) {
      try {
        this.isLoading = true;

        const result = await this.getArticl(id);

        this.title = result.data?.title;

        this.isLoading = false;
      } catch (error) {
        this.$store.dispatch("errors/setError", error);
      }
    },

    async submitDelete(id) {
      return axiosInstance({
        method: "DELETE",
        url: "/articls",
        data: {
          id,
        },
      });
    },
  },
};
</script>

<style scoped>
.grid {
  white-space: nowrap;
}

.grid a {
  display: inline-block;
}

a {
  align-self: center;
  justify-self: center;
  border: 0;
}
</style>
