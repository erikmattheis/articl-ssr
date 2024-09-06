<template>
  <article>
    <article>
      <h1>Not found</h1>
      <p>The page or the content requested by the page could not be found.</p>
    </article>
  </article>
</template>

<script>

export default {
  name: "ForbiddenPage",
  mounted() {
    this.setTitleAndDescriptionMixin({
      titleHtml: "Not Found",
    });
  },
};
</script>
