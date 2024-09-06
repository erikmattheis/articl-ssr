<template>
  <article>
    <h1>Search Articls</h1>

    <the-articls-search-form />

    <articls-list />
  </article>
</template>

<script>
import TheArticlsSearchForm from "~/components/layout/TheArticlsSearchForm.vue";
import ArticlsList from "~/components/layout/ArticlsList.vue";

export default {
  name: "ArticlsSearch",
  components: {
    TheArticlsSearchForm,
    ArticlsList,
  },
};
</script>
