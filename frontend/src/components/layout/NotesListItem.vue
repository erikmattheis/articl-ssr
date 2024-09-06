<template>
  <div :key="note.id">
    <div class="container">
      <div>
        <p
          v-if="
            $route.name === 'EditNoteSuccess' && note?.id === $route.params.id
          "
        >
          <ins>Your note was successfully updated.</ins>
        </p>
        <p>{{ note.fullText }}</p>
        <small
          >–{{ note.author?.nameFirst }} {{ note.author?.nameLast }}<br />
          {{ note.createdAt }}</small
        >
      </div>
      <div v-if="noteIsUsers && isLoggedInMixin" class="box">
        <div class="row-admin-box">
          <router-link
            role="button"
            :to="{ name: 'EditNote', params: { id: note.id } }"
          >
            <vue-feather size="0.7rem" type="edit" aria-label="Edit note" />
          </router-link>

          <router-link
            role="button"
            :to="{ name: 'DeleteNote', params: { id: note?.id } }"
          >
            <vue-feather size="0.7rem" type="delete" aria-label="Delete note" />
          </router-link>
        </div>
      </div>
    </div>

    <notes-form
      v-if="
        routeName === 'EditNote' &&
        note?.id === $route.params.id &&
        user.id === note.author.id
      "
      :passed-note="note"
      @note-updated="noteUpdated"
    />

    <notes-delete
      v-else-if="
        routeName === 'DeleteNote' &&
        note?.id === $route.params.id &&
        user.id === note.author.id
      "
      :passed-note="note"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import NotesDelete from "~/components/layout/NotesDelete.vue";
import NotesForm from "~/components/layout/NotesForm.vue";
import VueFeather from "vue-feather";
import { toFormattedUserDateTime } from "~/services/dateTimesService";

export default {
  components: {
    NotesDelete,
    NotesForm,
    VueFeather,
  },
  props: {
    passedNote: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      note: {},
      confirmDelete: false,
      noteIsUsers: false,
    };
  },
  emits: ["note-updated"],
  computed: {
    ...mapGetters({
      user: "users/user",
    }),
    routeName() {
      return this.$route.name;
    },
    noteDate() {
      return toFormattedUserDateTime(this.note.createdAt);
    },
  },
  created() {
    if (this.passedNote.id) {
      this.note = this.passedNote;
      this.noteIsUsers = this.passedNote?.author?.id === this.user?.id;
    }
    this.$watch(
      () => this.$store.getters["resources/notes"],
      (notes) => {
        const note = notes.find((n) => n.id === this.passedNote.id);
        if (note) {
          this.note = note;
        }
      }
    );
  },
  watch: {
    passedNote: function (newNote) {
      this.note = newNote;
      this.noteIsUsers = newNote?.author?.id === this.user?.id;
    },
  },
  methods: {
    noteUpdated(note) {
      this.$emit("note-updated", note);
    },
  },
};
</script>
<style scoped type="scss">
.container {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: minmax(min-content, 1fr) min-content;
  color: #444;
  border-bottom: 1px solid var(--muted-border-color);
}
</style>
