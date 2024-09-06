<template>
  <li class="articl">
    <ul>
      <li class="title container">
        <a
          :data-tooltip="linkMessage"
          :href="articl.url"
          class="box"
          target="_blank"
          >{{ articl.title }}
        </a>
        <articl-actions
          v-if="isLoggedInMixin"
          :id="articl.id"
          class="box"
          :title="articl.title"
          :slug="articl.slug"
          :type="articl.type"
        />
      </li>

      <li class="articl-details">
        <articl-author
          v-for="(author, index) in articl.authors"
          :author="author"
          :key="index"
          :last="index === articl.authors.length - 1"
        />
      </li>

      <li v-if="articl.journal" class="articl-details">
        <a data-tooltip="linkMessage" :href="articl.url" target="_blank">{{
          articl.journal
        }}</a
        >{{ articlJornalCommaOrNot }} {{ monthStr }}{{ articlDateCommaOrNot
        }}{{ articl.year }}
      </li>

      <li v-if="articl.authorsOrig" class="articl-details">
        {{ articl.authorOrig }}
      </li>

      <li v-if="articl.affilliations" class="articl-details">
        Affilliations: {{ articl.affilliations }}
      </li>

      <li v-if="articl.institution" class="articl-details">
        Institution: {{ articl.institution }}
      </li>

      <li v-if="articl.source" class="articl-details">{{ articl.source }}</li>

      <li v-if="1 === 2 && articl.abstract" class="articl-details">
        <details>
          <summary>Abstract</summary>
          <div>{{ articl.abstract }}</div>
        </details>
      </li>

      <li v-if="articl.fullText" class="articl-details">
        <details>
          <summary>Full text</summary>
          <div>{{ articl.fullText }}</div>
        </details>
      </li>

      <li v-if="articl.thumbnailImage" class="articl-details">
        <img :src="articl.thumbnailImage" :alt="articl.title" />
      </li>

      <li
        v-if="articl.url && articl.articlType == 'Images'"
        class="articl-details"
      >
        <img :src="articl.url" :alt="articl.title" />
      </li>

      <li v-if="articl.imageCaption" class="articl-details">
        Caption: {{ articl.imageCaption }}
      </li>
    </ul>
  </li>
</template>

<script>
import { mapGetters } from "vuex";

import ArticlActions from "~/components/layout/ArticlActions.vue";
import ArticlAuthor from "~/components/layout/ArticlAuthor.vue";
import {
  highlightedSubstring,
  isNumber,
  noCaseIndexOf,
} from "~/services/stringsService";

export default {
  components: {
    ArticlActions,
    ArticlAuthor,
  },
  props: {
    articl: {
      type: Object,
      default: null,
    },
    q: {
      type: String,
      default: null,
    },
  },
  data: () => ({}),
  computed: {
    ...mapGetters({
      params: "articlsParams/params",
    }),
    articlDateCommaOrNot() {
      if (this.articl.month && this.articl.year) {
        return ", ";
      }
      return "";
    },
    articlJornalCommaOrNot() {
      if (this.articl.journal && this.articl.year) {
        return ",";
      }
      return "";
    },
    monthStr() {
      if (!isNumber(Number(this.articl.month))) {
        return this.articl.month;
      }

      return [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ][this.articl.month - 1];
    },
    linkMessage() {
      try {
        return `Read article on ${new URL(this.articl.url).hostname.replace("www.", "")}`;
      } catch {
        return "Malformed url";
      }
    },
    authorsList() {
      if (this.articl?.authors?.map) {
        let list;
        if (typeof this.articl.authors[0] === "string") {
          list = this.articl.authors;
        } else {
          list = this.articl.authors.map(
            (author) => `${author.nameFirst} ${author.nameLast}`
          );
          list = list.join(", ");
          return list;
        }

        if (this.articl?.authorsOrig?.length) {
          list = this.articl.authorsOrig;
        }
        return list;
      }
    },
  },
  methods: {
    highlightedSubstring,
    noCaseIndexOf,
  },
};
</script>

<style scoped lang="scss">
.container {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: minmax(min-content, 1fr) min-content;
  color: #444;
}

.articl > ul > li {
  padding: 0.5rem;
  width: 100%;
  margin: 0;

  a {
    cursor: pointer;
  }
}

.articl {
  border-bottom: 1px solid $grey-100;
  margin-bottom: calc(var(--typography-spacing-vertical) * 0.5);
}

.articl:last-child {
  border: 0 !important;
}

.authors-list {
  margin-bottom: calc(var(--typography-spacing-vertical) * 0.25);
}

details {
  margin-bottom: calc(var(--typography-spacing-vertical) * 0.25);
  border-bottom: 0;
}

summary,
details,
.articl-details {
  font-size: 0.7rem;
}

a {
  cursor: pointer;
}

#app > main > article > div > div > small > ul > li > a {
  margin-top: 0.5rem;
  margin-left: 0.5rem;
  color: red !important;
  cursor: pointer;
}

strong:not([class="not-strong"]) {
  padding: 0.2rem 0.1rem;
  color: black;
  background-color: #749157;
}
</style>
