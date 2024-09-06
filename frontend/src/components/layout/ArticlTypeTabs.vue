<template>
  <ul class="nav-tabs nav-tabs-inner-margin">
    <li :class="{ active: !articlType }">
      <a
        href="#"
        @click.prevent="changeArticlType('')"
        @keyup.enter.prevent="changeArticlType('')"
      >
        All</a
      >
    </li>
    <li v-for="t in articlTypes" :key="t" :class="{ active: t === articlType }">
      <a
        href="#"
        @click.prevent="changeArticlType(t)"
        @keyup.enter.prevent="changeArticlType(t)"
      >
        {{ t }}</a
      >
    </li>
    <li>
      <button-new-articl />
    </li>
  </ul>
</template>

<script>
import { mapGetters } from "vuex";
import ButtonNewArticl from "~/components/ui/ButtonNewArticl.vue";

export default {
  name: "ArticlTypeTabs",
  components: {
    ButtonNewArticl,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      slug: "resources/slug",
      articlTypes: "resources/articlTypes",
      articlType: "resources/articlType",
    }),
  },
  methods: {
    changeArticlType(articlType) {
      //this.$store.dispatch("resources/articlType", articlType);

      this.$router.push({
        name: "ArticlsList",
        params: { slug: this.slug, articlType },
      });
    },
  },
};
</script>
