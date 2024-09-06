<template>
  <router-link
    :to="{ name: 'CreateArticlPage', query: { articlType: $route.params.articlType || '', slug: $route.params.slug || '0' } }">
    <button class="bright-button">New Articl Here</button>
  </router-link>
</template>

<script>
export default {

  name: "ButtonNewArticl",

};
</script>

<style scoped>
button {
  font-size: 0.7rem;
}
</style>
