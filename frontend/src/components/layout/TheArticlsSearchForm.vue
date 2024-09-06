<template>
  <form>
    <div>
      <label for="q">Search <input id="q" v-model="q" type="text" /></label>
    </div>

    <div class="flex-parent">
      <label for="searchTitle" v-for="field in allSearchFields" :key="field">
        <input
          :id="field"
          type="checkbox"
          :name="field"
          :checked="searchFields.includes(field)"
          :aria-checked="searchFields.includes(field)"
          role="switch"
          class="checkbox-label"
          @click="toggle(field)"
        />
        {{ field }}</label
      >
    </div>
  </form>

  <section>
    <div v-for="articl in articls" :key="articl.id">
      <articls-list-item :articl="articl" :q="q" :order="articl.order" />
    </div>
  </section>
  <!--
    <button @click.prevent="submitForm">Search</button> <vue-feather type="filter"
      size="0.7rem" />
      -->
</template>

<script>
import { mapGetters } from "vuex";
import { debounce } from "lodash";

import axiosInstance from "~/services/axiosService";
import ArticlsListItem from "~/components/layout/ArticlsListItem.vue";
import {
  highlightMatchedText,
  urlParamIsFalsy,
} from "~/services/stringsService";

export default {
  name: "TheArticlsSearchForm",
  components: {
    ArticlsListItem,
  },
  data() {
    return {
      articls: [],
      allTypes: this.$store.state.articlsParams.allTypes,
      yearsStart: this.$store.state.articlsParams.yearsStart,
      yearComparisons: this.$store.state.articlsParams.yearComparisons,
      year: null,
      allSearchFields: [
        "titleHtml",
        "author",
        "journal",
        "institution",
        "abstract",
      ],
    };
  },
  computed: {
    q() {
      return this.$route.query.q || "";
    },
    searchFields() {
      return this.$route.query.searchFields?.split(",") || ["title"];
    },
    ...mapGetters({
      years: "articlsParams/years",
    }),
    yearComparison: {
      get() {
        return this.$store.state.articlsParams.yearComparison;
      },
      set(value) {
        this.$store.dispatch("articlsParams/yearComparison", value);
      },
    },
    types: {
      get() {
        return this.$store.state.articlsParams.types;
      },
      set(value) {
        this.$store.dispatch("articlsParams/types", value);
      },
    },
    years: {
      get() {
        return this.$store.state.articlsParams.types;
      },
      set(value) {
        this.$store.dispatch("articlsParams/types", value);
      },
    },
  },
  watch: {
    q: {
      handler: async function (newValue) {
        this.articls = await this.SearchArticls(newValue, this.searchFields);
      },
    },
    searchFields: {
      handler: async function (newValue) {
        this.articls = await this.SearchArticls(this.q, newValue);
      },
    },
  },
  async mounted() {
    this.setTitleAndDescriptionMixin({ titleHtml: "Search for articles" });

    this.articls = await this.SearchArticls(this.q, this.searchFields);
  },

  methods: {
    async SearchArticls(q, fields) {
      if (this.urlParamIsFalsy(q)) {
        return [];
      }

      const searchFieldsStr = fields?.join(",") || [];

      if (fields.length || q.length) {
        this.$router.push({
          path: this.$route.path,
          query: { q: q, searchFields: searchFieldsStr },
        });
      }

      if (q.length < 2) {
        return this.articls;
      }

      const response = await axiosInstance.get("/articls/search", {
        params: {
          q,
          searchFields: searchFieldsStr,
        },
      });

      const articls = response.data.map((articl) => {
        return this.highlight(articl, this.q);
      });
      return articls;
    },
    highlight(articl, q) {
      for (const key in articl) {
        if (Object.prototype.hasOwnProperty.call(articl, key)) {
          const value = articl[key];
          if (key === "authors" && value.map) {
            articl[key] = value.map((author) => {
              if (!author.nameFirst || !author.nameLast) {
                return author;
              }
              author.nameFirst = this.highlightMatchedText(author.nameFirst, q);
              author.nameLast = this.highlightMatchedText(author.nameLast, q);
              return author;
            });
          }
          articl[key] = this.highlightMatchedText(value, q);
        }
      }
      return articl;
    },
    debounce,
    highlightMatchedText,
    urlParamIsFalsy,

    toggle(field) {
      if (this.searchFields.includes(field)) {
        this.searchFields = this.searchFields.filter((item) => item !== field);
      } else {
        this.searchFields.push(field);
      }
      this.searchFieldsChanged();
    },
    async searchFieldsChanged() {
      this.articls = await this.SearchArticls(this.q, this.searchFields);
    },
    filterArticls(articls, q, searchFields) {
      if (!q.length > 1 || !this.articls.filter) {
        return articls;
      }
      const filtered = articls?.filter((articl) => {
        for (const key in searchFields) {
          if (Object.prototype.hasOwnProperty.call(articl, key)) {
            if (
              key === "authors" &&
              this.stringIsInAuthorName(articl[key], q)
            ) {
              return true;
            }
            if (
              articl[key].toLowerCase &&
              articl[key].toLowerCase().includes(q.toLowerCase())
            ) {
              return true;
            }
          }
          return false;
        }
      });
      return filtered;
    },
    stringIsInAuthorName(authors, q) {
      if (authors.filter) {
        return authors.some((author) => {
          if (author?.nameFirst.toLowerCase().includes(q?.toLowerCase())) {
            return true;
          }
          if (author?.nameLast.toLowerCase().includes(q?.toLowerCase())) {
            return true;
          }

          return false;
        });
      }
    },
  },
};
</script>

<style scoped>
.flex-parent {
  display: flex;
}

.flex-parent > * {
  width: min-width;
  margin-right: 0.5rem;
}

.checkbox-label {
  display: inline-block;
  margin-right: 0.5rem;
}

.checkbox-label::not(:last-child) {
  margin-right: 0.5rem;
}
</style>
