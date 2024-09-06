<template>
  <article>
    <h1>Delete Category</h1>

    <p>
      Really delete "{{ title }}"? This will permanently delete the category and
      make child categories and articls permanantly unreachable. There are
      {{ categories.length }} descendent categories and
      {{ articls.length }} articls.
    </p>

    <form>
      <button
        :aria-busy="buttonDisabled"
        @click.prevent="
          $router.push({ name: 'CategoriesList', params: { slug: parentSlug } })
        "
      >
        Cancel
      </button>
      <button
        v-if="slug"
        :aria-busy="buttonDisabled"
        @click.prevent="deleteCategory()"
      >
        Delete
      </button>
    </form>
  </article>
</template>

<script>
import { mapGetters } from "vuex";
import axiosInstance from "~/services/axiosService";

export default {
  name: "DeleteCategory",
  components: {},

  data: () => ({
    buttonDisabled: false,
    categories: [],
    articls: [],
    title: "",
    slug: "",
    parentSlug: "",
    id: "",
  }),
  computed: {
    ...mapGetters({
      filteredArticls: "resources/filteredArticls",
      articlType: "resources/articlType",
    }),
  },
  async mounted() {
    this.id = this.$route.params.id;
    this.slug = this.$route.params.slug;
    this.articlType = this.$route.params.articlType;
    await this.getCurrentCategory(this.slug);
  },
  methods: {
    async getCurrentCategory(slug) {
      try {
        this.isLoading = true;

        const result = await this.getCategory(slug);
        Object.assign(this, result.data);
        this.title = result.data?.category[0]?.title;
        this.articls = result.data?.articls?.length;
        this.setTitleAndDescriptionMixin({
          title: `Delete ${this.title} and Descendent Categories`,
        });
        this.parentSlug = result.data?.category[0]?.parentSlug;
        this.isLoading = false;
      } catch (error) {
        this.$store.dispatch("errors/setError", error);
      }
    },
    async getCategory(slug) {
      return axiosInstance({
        method: "GET",
        url: `/resource/${slug}`,
      });
    },
    async deleteCategory() {
      try {
        this.buttonDisabled = true;

        await this.submitDelete(this.id);

        this.$store.dispatch("modals/setSuccessTitle", "Deletion successful.");

        this.$store.dispatch(
          "modals/setSuccessMessage",
          `The category "${this.title}" has been permanently deleted.`
        );
        if (Number(this.parentSlug) === 0) {
          this.$router.push("");
        } else {
          this.$router.push({
            name: "ResourceIndex",
            params: { slug: this.parentSlug },
          });
        }
      } catch (error) {
        this.$store.dispatch("errors/setError", error);
      } finally {
        this.buttonDisabled = false;
      }
    },
    async submitDelete(id) {
      return axiosInstance({
        method: "DELETE",
        url: `/categories/${id}`,
      });
    },
  },
};
</script>
