<template>
  <div>
    <articl-type-tabs />
    <ul class="nav-inner-content">
      <li>
        <select v-model="sortBy" @change="sortArticlsBy">
          <option value="title">Title</option>
          <option value="year">Year Published</option>
          <option value="createdAt">Date Added</option>
        </select>
      </li>
      <articls-list-item
        :articl="articl"
        v-for="(articl, index) in articls"
        :key="index"
      />
    </ul>

    <div v-if="articls?.length === 0">No entries yet.</div>
  </div>
</template>

<script>
import ArticlsListItem from "~/components/layout/ArticlsListItem.vue";
import ArticlTypeTabs from "~/components/layout/ArticlTypeTabs.vue";

import { mapGetters } from "vuex";

import axiosInstance from "~/services/axiosService";

export default {
  name: "ArticlsList",
  data() {
    return {
      isLoading: false,
    };
  },
  components: {
    ArticlsListItem,
    ArticlTypeTabs,
  },
  computed: {
    sortBy() {
      this.$route.query.createdAt || "createdAt";
    },
    ...mapGetters({
      filteredArticls: "resources/filteredArticls",
      articlType: "resources/articlType",
    }),
    articls() {
      return this.filteredArticls(this.articlType, this.sortBy);
    },
  },
  methods: {
    sortArticlsBy(e) {
      this.sortBy = e.target.value;
      this.sortArticlsByAnyKey(this.articlType, e.target.value);
      this.$router.push({ query: { sortBy: e.target.value } });
    },
    sortArticlsByAnyKey(key, sortBy) {
      this.$store.dispatch("resources/sortArticlsByAnyKey", key, sortBy);
    },
    updateArticlsOrderValues() {
      try {
        this.articls.forEach((obj, index) => {
          const objRef = obj;

          objRef.order = index;
        });
      } catch (error) {
        this.$store.dispatch("errors/setError", error);
      }
    },

    async saveArticlsOrderValues() {
      try {
        const order = this.articls.map((obj) => ({
          id: obj.id,
          order: obj.order,
        }));

        await this.saveArticlsOrder(order);
      } catch (error) {
        this.$store.dispatch("errors/setError", error);
      }
    },

    async saveArticlsOrder(order) {
      this.isLoading = true;

      const result = await axiosInstance({
        method: "POST",
        url: "/articls/order",
        data: {
          order,
        },
      });

      this.isLoading = false;

      return result.data;
    },

    onUpdateArticlsOrderValues() {
      this.updateArticlsOrderValues(this.articlType);

      this.saveArticlsOrderValues(this.articlType);
    },
  },
};
</script>

<style scoped>
select {
  max-width: 250px;
  margin: 0 0 0.5rem 0.5rem;
}
</style>
