<template>
  <div class="container">
    <router-link
      class="box"
      :to="{ name: tabName, params: { slug: category.slug || '0' } }"
    >
      {{ category.title }}
    </router-link>
    <category-actions
      v-if="isLoggedInMixin"
      :id="category.id"
      class="box"
      :slug="category.slug || '0'"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CategoryActions from "~/components/layout/CategoryActions.vue";

export default {
  name: "CategoriesListItem",

  components: {
    CategoryActions,
  },
  props: {
    category: {
      type: Object,
      default: {},
    },
  },
  computed: {
    ...mapGetters({
      treeLevel: "resources/treeLevel",
    }),
    tabName() {
      return this.treeLevel !== 3 ? "CategoriesList" : "ArticlsList";
    },
  },
  methods: {},
};
</script>
