<template>
  <article>
    <h1 v-if="!success">{{ formAction }} Articl</h1>
    <template v-else>
      <h1>Articl Created</h1>
      <ul>
        <li>
          <a
            tabindex="0"
            href
            @click.prevent="$router.go()"
            @keyup.enter.prevent="$router.go()"
            >Create another articl in the same category</a
          >
        </li>
        <li>
          <a
            tabindex="0"
            href
            @click.prevent="$router.push(`/resource/${slug}/articls`)"
            @keyup.enter.prevent="$router.push(`/resource/${slug}/articls`)"
            >Return to Category Page
          </a>
        </li>
      </ul>
    </template>

    <template v-if="!isLoading && !success">
      <form>
        <template v-if="!id">
          <label for="url"
            >URL <input id="url" v-model="url" type="text" name="url"
          /></label>
          <button
            type="button"
            :aria-busy="buttonFetchDisabled"
            @click.prevent="getData()"
          >
            FETCH DATA
          </button>
        </template>
        <label for="title"
          >Title
          <input id="title" v-model="title" name="title" autocomplete="off" />
        </label>

        <label v-if="doi" for="doi"
          >DOI
          <input id="doi" v-model="doi" name="doi" autocomplete="off" />
        </label>

        <fieldset v-for="(author, index) in authors" :key="author.id">
          <div class="grid">
            <label for="`nameFirst${index}`"
              >First name
              <input
                :id="`nameFirst${index}`"
                v-model="author.nameFirst"
                :name="`nameFirst${index}`"
                autocomplete="off"
            /></label>
            <label for="`nameLast${index}`"
              >Last name
              <input
                :id="`nameLast${index}`"
                v-model="author.nameLast"
                :name="`nameLast${index}`"
                autocomplete="off"
            /></label>
          </div>

          <label
            v-for="(affiliation, affilIndex) in author.affilliations"
            :key="affiliation"
            for="`affiliation${affilIndex}`"
            >Affiliation

            <input
              id="`affiliation${affilIndex}`"
              v-model="author.affilliations[affilIndex]"
              name="`affiliation${affilIndex}`"
              autocomplete="off"
          /></label>
        </fieldset>

        <label for="institution"
          >Institution
          <input
            id="institution"
            v-model="institution"
            name="institution"
            autocomplete="off"
        /></label>

        <label for="journal"
          >Journal
          <input
            id="journal"
            v-model="journal"
            name="journal"
            autocomplete="off"
        /></label>

        <label for="year"
          >Publication Year
          <input id="year" v-model="year" name="year" autocomplete="off"
        /></label>

        <label for="month"
          >Publication Month
          <input id="month" v-model="month" name="month" autocomplete="off"
        /></label>

        <label for="abstract"
          >Abstract
          <input
            id="abstract"
            v-model="abstract"
            name="abstract"
            autocomplete="off"
        /></label>

        <label for="articlType"
          >Resource type
          <select
            id="articlType"
            v-model="articlType"
            name="articlType"
            autocomplete="off"
          >
            <optgroup value="Resources">
              <option value="Review (OA)">Review (OA)</option>
              <option value="Review (OA)">Review (PA)</option>
              <option value="Research (OA)">Research (OA)</option>
              <option value="Research (PA)">Research (PA)</option>
              <option value="Web">Web</option>
              <!---
              <option value="Images">
                Images
              </option>
              -->
              <option value="Presentations">Presentations</option>
              <option value="Videos">Videos</option>
              <option value="Podcast">Podcast</option>
            </optgroup>
          </select></label
        >

        <input-typeahead
          src="/categories/titles"
          query="category"
          :input-value="slug"
          label-value="Category slug"
          @update-value="onTypeaheadHit"
          @keyup="onTypeaheadHit"
        />

        <button
          :aria-busy="buttonDisabled"
          @click.prevent="
            $router.push({ name: 'ArticlsList', params: { slug } })
          "
        >
          Cancel
        </button>
        <button
          type="button"
          :aria-busy="buttonDisabled"
          @click.prevent="submitForm(id)"
        >
          {{ !id ? "Create" : "Edit" }} Articl
        </button>
      </form>
    </template>
  </article>
</template>

<script>
// import cardNotification from '~/components/ui/CardNotification.vue';
import inputTypeahead from "~/components/ui/InputTypeahead.vue";
import LoadingPlaceholder from "~/components/ui/LoadingPlaceholder.vue";
import { fetchData } from "~/services/fetchingService";
import axiosInstance from "~/services/axiosService";

export default {
  name: "EditArticlPage",
  components: {
    LoadingPlaceholder,
    inputTypeahead,
  },

  props: {
    editId: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      id: "",
      abstract: "",
      doi: "",
      url: "",
      authorsOrig: "",
      authors: [],
      institution: "",
      buttonDisabled: false,
      buttonFetchDisabled: false,
      formAction: "",
      isLoading: true,
      journal: "",
      month: "",
      success: false,
      title: "",
      articlType: "Review (OA)",
      year: "",
    };
  },
  async mounted() {
    this.id = this.editId;
    this.formAction = this.id ? "Edit" : "Create";
    if (!this.id) {
      this.slug = this.$route.query.slug;

      this.onTypeaheadHit({
        value: this.slug,
      });

      this.isLoading = false;
    } else {
      this.getCurrentArticl(this.id);
    }

    this.setTitleAndDescriptionMixin({
      titleHtml: `${this.formAction} Articl`,
    });

    /*
        const insert = await axiosInstance({
          method: "GET",
          url: `/imports/import-articls/batch`,
        });
    */
  },
  slug() {
    return this.$route.query.slug || "0";
  },
  methods: {
    async getCurrentArticl(id) {
      try {
        this.isLoading = true;

        const result = await this.getArticl(id);

        Object.assign(this, result.data);

        this.isLoading = false;
      } catch (error) {
        this.$store.dispatch("errors/setError", error);
      }
    },
    async getData() {
      if (this.url) {
        try {
          this.buttonFetchDisabled = true;

          const result = await fetchData(this.url);

          if (result) {
            Object.assign(this, result);
          }
        } catch (error) {
          this.$store.dispatch("errors/setError", error);
        } finally {
          this.buttonFetchDisabled = false;
        }
      } else {
        this.$store.dispatch("errors/setError", "Please enter a URL");
      }
    },
    resetFormErrors() {
      this.success = null;

      this.result = null;

      this.errorMessage = "";
    },
    checkForm() {
      this.resetFormErrors();

      let passed = true;

      if (this.title === "") {
        this.errorMessage = "Please enter a title.";

        passed = false;
      } else if (this.authors === "") {
        this.errorMessage = "Please enter author names.";

        passed = false;
      } else if (this.articlType === "") {
        this.errorMessage = "Please choose a link type.";

        passed = false;
      }

      return passed;
    },
    async submitForm(id) {
      const url = `/articls/${id}`;

      try {
        this.resetFormErrors();

        if (this.checkForm() === true) {
          this.buttonDisabled = true;

          const verb = id ? "PUT" : "POST";
          const result = await axiosInstance({
            method: verb,
            url,
            data: {
              abstract: this.abstract,
              url: this.url,
              articlType: this.articlType,
              authors: this.authors,
              institution: this.institution,
              slug: this.slug,
              journal: this.journal,
              month: this.month,
              title: this.title,
              year: this.year,
            },
          });

          this.success = true;
          this.abstract = result.data.abstract;
          this.doi = result.data.doi;
          this.url = result.data.url;
          this.authorsOrig = result.data.authorsOrig;
          this.authors = result.data.authors;
          this.journal = result.data.journal;
          this.month = result.data.month;
          this.title = result.data.title;
          this.articlType = result.data.articlType;

          this.year = "";

          const resultVerb = id ? "Created" : "Edited";
          this.setTitleAndDescriptionMixin({
            titleHtml: `Articl ${resultVerb}`,
          });
        } else {
          this.$store.dispatch("errors/setError", this.errorMessage);
        }
      } catch (error) {
        this.$store.dispatch("errors/setError", error);
      } finally {
        this.buttonDisabled = false;
      }
    },

    async getArticl(id) {
      return axiosInstance({
        method: "GET",
        url: `/articls/${id}`,
      });
    },

    onTypeaheadHit(e) {
      this.slug = e.value;
    },
  },
};
</script>

<style scoped>
button {
  margin-top: var(--typography-spacing-vertical);
}
</style>
