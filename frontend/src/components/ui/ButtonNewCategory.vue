<template>
  <router-link :to="{ name: 'CreateCategoryPage', query: { parentSlug: $route.params.slug || '0' } }">
    <button class="bright-button">New Category Here</button>
  </router-link>
</template>

<script>
export default {

  name: "ButtonNewCategory",

};
</script>

<style scoped>
button {
  font-size: 0.7rem;
  width: min-content;
}
</style>
