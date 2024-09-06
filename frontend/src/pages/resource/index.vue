<template>
  <section>
    <the-breadcrumbs />
    <h1>{{ title }}</h1>
    <router-view></router-view>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
import axiosInstance from "~/services/axiosService";
import TheBreadcrumbs from "~/components/layout/TheBreadcrumbs.vue";

export default {
  components: {
    TheBreadcrumbs,
  },
  data() {
    return {
      isLoading: true,
      results: {},
      slug: "",
      title: "",
    };
  },
  computed: {
    ...mapGetters({
      categories: "resources/categories",
      treeLevel: "resources/treeLevel",
      htmlTitle: "resources/htmlTitle",
    }),
  },
  created() {
    // this.importArticls();
    this.getCategoryResources(this.$route.params.slug);
    this.$store.dispatch("resources/slug", this.$route.params.slug);
    this.$store.dispatch("resources/articlType", this.$route.params.articlType);
  },
  beforeRouteUpdate(to, from) {
    this.navigate(to, from);
  },
  beforeRouteLeave(to, from) {
    this.navigate(to, from);
  },
  methods: {
    navigate(to, from) {
      if (to.params.articlType !== from.params.articlType) {
        this.$store.dispatch("resources/articlType", to.params.articlType);
      }
      if (to.params.slug !== from.params.slug) {
        this.$store.dispatch("resources/slug", to.params.slug);
        this.getCategoryResources(to.params.slug);
      }
    },
    async getCategoryResources(slug) {
      try {
        this.isLoading = true;
        const results = await this.fetchData(slug);
        this.updateValues(results);
      } catch (error) {
        this.$store.dispatch("errors/setError", error);
      } finally {
        this.isLoading = false;
      }
    },

    updateValues(results) {
      try {
        if (results.categories?.length) {
          this.$store.dispatch("resources/categories", results.categories);
        } else {
          this.$store.dispatch("resources/categories", []);
        }

        if (results.breadcrumbs?.length) {
          this.$store.dispatch("resources/breadcrumbs", results.breadcrumbs);
        } else {
          this.$store.dispatch("resources/breadcrumbs", []);
        }

        if (results.articls?.length) {
          this.$store.dispatch("resources/articls", results.articls);
        } else {
          this.$store.dispatch("resources/articls", []);
        }

        if (results.notes?.length) {
          this.$store.dispatch("resources/notes", results.notes);
        } else {
          this.$store.dispatch("resources/notes", []);
        }

        this.title = results.category[0]?.title;

        this.titleHtml = results.category[0]?.titleHtml;

        const description = results.category[0]?.description;

        this.setTitleAndDescriptionMixin({
          titleHtml: this.titleHtml,
          description: description,
        });
      } catch (error) {
        this.$store.dispatch("errors/setError", error);
      }
    },
    async fetchData(slug) {
      const result = await axiosInstance({
        method: "GET",
        url: `/resource/${slug || ""}`,
      });
      const articlTypes = result.articls
        ? Object.keys(result.data.articls)
        : [];
      return {
        breadcrumbs: result.data.breadcrumbs,
        categories: result.data.categories,
        category: result.data.category,
        articlTypes,
        articls: result.data.articls,
        notes: result.data.notes,
      };
    },
    async importArticls() {
      const result = await axiosInstance({
        method: "GET",
        url: `/imports/import-articls/batch`,
      });
      console.log("result", result);
    },
  },
};
</script>
