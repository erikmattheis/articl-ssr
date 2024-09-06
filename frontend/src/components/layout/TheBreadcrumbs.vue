<template>
  <ul class="breadcrumbs">
    <li>
      <router-link
        to="/">
        <small>Home</small>
      </router-link> /
    </li>
    <li
      v-for="(breadcrumb, index) in breadcrumbs"
      :key="breadcrumb">
      <router-link
        v-if="index !== breadcrumbs.length - 1"
        :to="{ name: index < 3 ? 'CategoriesList' : 'ArticlsList', params: { slug: breadcrumb.slug } }">
        <small>{{ breadcrumb.title }}</small>
      </router-link>
      <span v-else><small>{{ breadcrumb.title }}</small></span>
      <span v-if="index !== breadcrumbs.length - 1"> / </span>
    </li>
  </ul>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "TheBreadcrumbs",
  computed: {
    ...mapGetters({
      breadcrumbs: "resources/breadcrumbs",
    }),
  },
};
</script>

<style scoped>
body ul.breadcrumbs {
  display: inline !important;
}


body ul.breadcrumbs li {
  font-size: 0.9rem;
  padding-top: 0;
  padding-bottom: calc(var(--nav-element-spacing-vertical) * 0.5);
  vertical-align: top !important;
  list-style-type: none !important;
  display: inline !important;
}
</style>
