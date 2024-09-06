<template>
  <template v-if="!deleted">
    <p>
      Really delete the note
      <span v-if="fullText?.length > 64"> that begins, </span> "{{
        fullText?.substring(0, 64)
      }}" by {{ nameFirst }} {{ nameLast }}?
    </p>
    <form>
      <button
        :aria-busy="buttonDisabled"
        @click.prevent="$router.push({ name: 'TabNotes', params: { slug } })"
      >
        Cancel
      </button>
      <button :aria-busy="buttonDisabled" @click.prevent="deleteNote()">
        Delete
      </button>
    </form>
  </template>
</template>

<script>
import axiosInstance from "~/services/axiosService";

export default {
  data: () => ({
    buttonDisabled: true,
    deleted: false,
    id: "",
    fullText: "",
    nameFirst: "",
    nameLast: "",
    slug: "",
  }),
  mounted() {
    this.id = this.$route.params.id;
    this.getCurrentNote(this.id);
    this.slug = this.$route.params.slug;
  },
  methods: {
    async getCurrentNote(id) {
      try {
        this.isLoading = true;
        const result = await this.getNote(id);
        if (result.data) {
          this.fullText = result.data.fullText;
          this.nameFirst = result.data.author.nameFirst;
          this.nameLast = result.data.author.nameLast;
          this.buttonDisabled = false;
        } else {
          this.$store.dispatch("errors/setError", "No note found.");
        }

        this.isLoading = false;
      } catch (error) {
        this.$store.dispatch("errors/setError", error);
      }
    },
    async deleteNote() {
      try {
        this.buttonDisabled = true;

        await this.submitDelete(this.id);

        this.deleted = true;
        this.$store.dispatch("resources/removeNote", this.id);

        this.deleted = true;
      } catch (error) {
        this.$store.dispatch("errors/setError", error);
      }
    },
    async getNote(id) {
      return axiosInstance({
        method: "GET",
        url: `/notes/${id}`,
      });
    },

    async submitDelete(id) {
      return axiosInstance({
        method: "DELETE",
        url: "/notes",
        data: {
          id,
        },
      });
    },
  },
};
</script>

<style scoped>
.grid {
  white-space: nowrap;
}

.grid a {
  display: inline-block;
}

a {
  align-self: center;
  justify-self: center;
  border: 0;
}
</style>
