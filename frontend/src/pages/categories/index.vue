<template>
  <article>
    <h1 v-if="!success">{{ formAction }} category</h1>
    <h1 v-else>Success</h1>
    <template v-if="!isLoading">
      <form v-if="!success">
        <label for="title"
          >Title <input id="title" v-model="title" type="text" name="title"
        /></label>
        <label for="title"
          >HTML Title
          <input
            id="titleHtml"
            v-model="titleHtml"
            type="text"
            name="titleHtml"
        /></label>
        <div v-for="(summary, index) in AISummaries" :key="index">
          <label for="selectedAIDescriptionIndex">
            <input
              type="radio"
              name="selectedAIDescriptionIndex"
              id="selectedAIDescriptionIndex"
              :value="index"
              v-model="selectedAIDescriptionIndex"
            />
            {{ summary.message?.content }}</label
          >
          <p>{{ AIError }}</p>
        </div>
        <button
          type="button"
          :disabled="!categoryStringFromTitle || aiButtonDisabled"
          :aria-busy="aiButtonDisabled"
          @click.prevent="getAISummaries"
        >
          <span v-if="!aiButtonDisabled">{{ aiButtonMessage }}</span>
        </button>

        <label for="description"
          >Description
          <textarea
            id="description"
            v-model="selectedDescription"
            name="description"
            rows="10"
            cols="70"
            @keyup="editAIDescription"
          />
        </label>
        <label for="slug"
          >Slug <input id="slug" v-model="editingSlug" type="text" name="slug"
        /></label>
        <label for="parentSlug"
          >Parent slug
          <input
            id="parentSlug"
            v-model="parentSlug"
            type="text"
            name="parentSlug"
        /></label>
        <button
          type="submit"
          :aria-busy="buttonDisabled"
          @click.prevent="submitForm(id)"
        >
          <span v-if="!buttonDisabled">{{ formAction }} category</span>
        </button>
      </form>
      <template v-else>
        <card-notification success-message="Category created." />
        <a href @click="$router.go()" @keyup.enter="$router.go()"
          >Create another category</a
        >
      </template>
    </template>
  </article>
</template>

<script>
import { mapGetters } from "vuex";
import CardNotification from "~/components/ui/CardNotification.vue";
import LoadingPlaceholder from "~/components/ui/LoadingPlaceholder.vue";
import axiosInstance from "~/services/axiosService";

export default {
  name: "CreateCategoryPage",
  components: {
    CardNotification,
    LoadingPlaceholder,
  },
  data: () => ({
    id: null,
    buttonDisabled: false,
    aiButtonMessage: "Get AI Summaries",
    categories: [],
    AISummaries: [],
    selectedAIDescriptionIndex: null,
    AIError: null,
    errorMessage: "",
    formAction: "",
    isLoading: null,
    slug: 0,
    parentSlug: 0,
    result: null,
    success: false,
    title: null,
    titleHtml: null,
    description: null,
    descriptionInvalid: null,
    titleHtmlInvalid: null,
    slugInvalid: null,
    parentIdInvalid: null,
  }),

  computed: {
    aiButtonDisabled() {
      return this.buttonDisabled || this.isLoading;
    },
    selectedDescription: {
      get() {
        return this.AISummaries[this.selectedAIDescriptionIndex]?.message
          .content;
      },
      set(newValue) {
        if (
          this.AISummaries[this.selectedAIDescriptionIndex]?.message.content
        ) {
          this.AISummaries[this.selectedAIDescriptionIndex].message.content =
            newValue;
        } else {
          this.AISummaries = [
            {
              message: {
                content: newValue,
              },
            },
          ];
        }
      },
    },
    editingSlug: {
      get() {
        let str = this.title || this.titleHtml;
        if (!str) {
          return "";
        }

        str = str.replace(/\s/g, "-");

        str = str.toLowerCase();

        str = encodeURI(str);

        str = str.replace(/'/g, "%27");

        return str;
      },
      set(newValue) {
        console.log(newValue);
        return newValue;
      },
    },
    categoryStringFromTitle() {
      return this.title || this.titleHtml;
    },
    ...mapGetters({
      breadcrumbs: "resources/breadcrumbs",
    }),
  },
  mounted() {
    this.parentSlug = this.$route.query.parentSlug;

    this.id = this.$route.params.id;

    this.formAction = this.id ? "Edit" : "Create";

    if (this.id) {
      this.getCurrentCategory(this.id);
    }

    this.setTitleAndDescriptionMixin({
      titleHtml: `${this.formAction} Category`,
    });
  },
  methods: {
    editAIDescription(a) {
      if (
        this.AISummaries[this.selectedAIDescriptionIndex]?.message.content &&
        this.AISummaries[this.selectedAIDescriptionIndex]?.message.content !==
          a.target.value
      ) {
        this.AISummaries[this.selectedAIDescriptionIndex].message.content =
          a.target.value;
      }
    },
    async getCurrentCategory(id) {
      try {
        this.isLoading = true;

        const result = await this.getCategory(id);
        this.selectedDescription = this.description = result.data.description;
        this.selectedAIDescriptionIndex = 0;
        this.aiButtonMessage = "Get More AI Summaries";
        this.order = result.data.order;
        this.parentSlug = result.data.parentSlug;
        this.title = result.data.title;
        this.titleHtml = result.data.titleHtml || result.data.title;
        this.slug = this.editingSlug = result.data.slug;
      } catch (error) {
        this.$store.dispatch("errors/setError", error);
      } finally {
        this.isLoading = false;
      }
    },
    async getCategory(id) {
      return axiosInstance({
        method: "GET",
        url: `/categories/${id}`,
      });
    },
    async getCategoryBySlug(slug) {
      return axiosInstance({
        method: "GET",
        url: "/categories/",
        params: {
          slug,
        },
      });
    },
    resetFormErrors() {
      this.success = null;
      this.result = null;
      this.errorMessage = "";
      this.AIError = "";
    },
    checkForm() {
      this.resetFormErrors();

      let passed = true;

      if (!this.title) {
        this.titleInvalid = true;

        this.errorMessage = "Please enter a title.";

        passed = false;
      }
      if (!this.titleHtml) {
        this.titleHtmlInvalid = true;

        this.errorMessage = "Please enter a HTML title.";

        passed = false;
      } else if (!this.editingSlug) {
        this.slugInvalid = true;

        this.errorMessage = "Please enter a slug.";

        passed = false;
      } else if (!this.parentSlug) {
        this.parentIdInvalid = true;

        this.errorMessage = "Please select a parent category.";

        passed = false;
      } else if (!this.description) {
        this.descriptionInvalid = true;

        this.errorMessage = "Please select or enter a description.";

        passed = false;
      }

      return passed;
    },
    async getAISummaries() {
      try {
        this.buttonDisabled = true;
        this.AIError = "";
        const data = {
          category: this.categoryStringFromTitle,
          parentCategory:
            this.breadcrumbs[this.breadcrumbs.length - 2]?.title || "",
        };

        const result = await axiosInstance({
          method: "POST",
          url: "/categories/ai-summary",
          data,
        });

        if (
          result.data?.status === 200 &&
          result.data?.message instanceof Array
        ) {
          this.AISummaries.push(...result.data.message);
          this.aiButtonMessage = "Get More AI Summaries";
        } else if (result.data?.message) {
          this.AIError = `Error status ${result.data?.status}: ${result.data.message}`;
        } else {
          this.AIError = "There was an unknown error generating AI summaries.";
        }
      } catch (error) {
        this.$store.dispatch("errors/setError", error);
      } finally {
        this.buttonDisabled = false;
      }
    },
    async submitForm(id) {
      try {
        this.resetFormErrors();

        if (this.checkForm() === true) {
          this.buttonDisabled = true;
          this.isLoading = true;
          const verb = id ? "PUT" : "POST";
          const possiblyEmtyId = id || "";
          const data = {
            title: this.title,
            titleHtml: this.titleHtml,
            slug: this.editingSlug,
            description: this.selectedDescription,
            parentSlug: this.parentSlug,
          };

          await axiosInstance({
            method: verb,
            url: `/categories/${possiblyEmtyId}`,
            data,
          });

          const titleVerb = id ? "Edited" : "Created";

          this.success = true;

          this.setTitleAndDescriptionMixin({ title: `Category ${titleVerb}` });

          this.$store.dispatch(
            "modals/setSuccessTitle",
            `Category ${titleVerb}`
          );

          this.$store.dispatch(
            "modals/setSuccessMessage",
            `The category was successfully ${titleVerb}.`
          );
          if (Number(this.parentSlug) === 0) {
            this.$router.push("");
          } else {
            this.$router.push({
              name: "ResourceIndex",
              params: { slug: this.parentSlug },
            });
          }
        } else {
          this.$store.dispatch("errors/setError", this.errorMessage);
        }
      } catch (error) {
        this.$store.dispatch("errors/setError", error);
      } finally {
        this.isLoading = false;
        this.buttonDisabled = false;
      }
    },
    removePunctuation(str) {
      return str.replace(/[^\w\s']|_/g, "").replace(/\s+/g, " ");
    },
  },
};
</script>
