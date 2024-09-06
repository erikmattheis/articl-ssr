<template>
  <form>
    <label for="fullText">
      <textarea id="fullText" v-model="fullText" name="fullText" />
    </label>
    <div class="grid">
      <div class="grid-right">
        <a
          :aria-busy="buttonDisabled"
          href
          role="button"
          @click.prevent="
            $router.push({
              name: 'TabNotes',
              params: { slug: $route.params.slug },
            })
          "
          >Cancel</a
        >

        <a
          href
          role="button"
          :aria-disabled="buttonDisabled"
          :aria-busy="buttonDisabled"
          @click.prevent="submitForm()"
        >
          {{ !note?.id ? "Create" : "Edit" }} Note</a
        >
      </div>
    </div>
  </form>
</template>

<script>
import axiosInstance from "~/services/axiosService";

export default {
  props: {
    passedNote: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["note-updated"],
  data() {
    return {
      note: {},
      fullText: "",
      fullTextOriginal: "",
      isLoading: false,
      formAction: false,
      noteCreated: false,
      buttonDisabled: false,
    };
  },

  mounted() {
    this.note = this.passedNote;

    if (!this.note?.id) {
      this.formAction = "Create";
    } else {
      this.fullText = this.note.fullText;
      this.fullTextOriginal = this.note.fullText;
      this.formAction = "Edit";
    }

    this.setTitleAndDescriptionMixin({
      titleHtml: `${this.formAction} Note`,
    });
  },
  methods: {
    cancel() {
      this.fullText = this.fullTextOriginal;
      this.$router.push({ name: "TabNotes" });
    },
    resetFormErrors() {
      this.errorMessage = "";
    },
    checkForm() {
      this.resetFormErrors();

      let passed = true;

      if (this.fullText === "") {
        this.errorMessage = "Please enter the text of the note.";

        passed = false;
      }

      return passed;
    },
    async submitForm() {
      let url = "/notes/";

      const id = this.note?.id;
      const data = {
        fullText: this.fullText,
      };

      if (id) {
        url = `/notes/${id}`;
      } else {
        data.slug = this.$route.params.slug;
      }

      try {
        this.resetFormErrors();

        if (this.checkForm() === true) {
          this.buttonDisabled = true;

          const verb = this.note?.id ? "PATCH" : "POST";

          const result = await axiosInstance({
            method: verb,
            url,
            data,
          });

          this.noteCreated = true;

          const resultVerb = this.note?.id ? "Updated" : "Created";
          this.setTitleAndDescriptionMixin({
            titleHtml: `Note ${resultVerb}`,
          });

          if (this.note?.id) {
            this.$store.dispatch("resources/setNote", result.data);
            this.$router.push({
              name: "EditNoteSuccess",
              params: { id: this.note.id },
            });
          } else {
            this.$store.dispatch("resources/addNote", result.data);
            this.$router.push({ name: "TabNotes" });
          }
        } else {
          this.$store.dispatch("errors/setError", this.errorMessage);
        }
      } catch (error) {
        this.$store.dispatch("errors/setError", error);
      } finally {
        this.buttonDisabled = false;
      }
    },
  },
};
</script>

<style scoped>
button,
.a {
  margin-top: var(--nav-link-spacing-vertical);
  margin-right: var(--nav-link-spacing-horizontal);
}

form {
  background-color: var(--muted-border-color);
  padding: var(--form-element-spacing-horizontal) !important;
}

textarea {
  width: 100%;
}
</style>
