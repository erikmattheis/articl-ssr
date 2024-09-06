<template>
  <div
    v-if="errorMessage || errorStack"
    class="modal-container"
    @click.prevent="close()"
    @keyup.enter="close()">
    <div
      open
      class="backdrop"
      @click.stop />
    <dialog
      open
      class="modal"
      @click.stop>
      <article class="max-container-width">
        <header>
          <vue-feather
            size="20"
            type="x-square"
            aria-label="Close"
            class="close"
            @click.prevent="close()" />
          <h2>Error</h2>
        </header>
        <section>
          <div
            class="tab left"
            title="error">
            <vue-feather
              size="3rem"
              type="alert-triangle"
              aria-label="Alert" />
          </div>
          <div class="tab right info">
            <ul>
              <li v-if="errorMessage">
                {{ errorMessage }}
              </li>
              <li v-if="errorStack">
                <small>{{ errorStack }}</small>
              </li>
            </ul>
          </div>
        </section>
        <button @click.prevent="close()">
          OK
        </button>
      </article>
    </dialog>
  </div>
</template>

<script>
import VueFeather from "vue-feather";
import { mapGetters } from "vuex";

export default {
  components: {
    VueFeather,
  },
  data: () => ({
    title: "",
    showErrorStack: "",
  }),
  computed: {
    ...mapGetters({
      errorMessage: "errors/errorMessage",
      errorStack: "errors/errorStack",
    }),
  },
  methods: {
    close() {
      this.$store.dispatch("errors/clearError");
    },
  },
};
</script>

<style scoped lang="scss">
.modal-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
}

.modal {
  width: 90%;
  margin: auto;
  border: 0.2rem;
}

article {
  width: 100%;
}

section {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
  width: 100%;
}

.tab {
  min-width: 3rem;
  min-height: 3rem;
  display: flex;
  padding: 0.5rem;
}

tab.left {
  flex: 0 0 3rem;
}

div.tab.right {
  flex: 1;
  padding: 1rem;
  color: #71001a;
  background-color: #fee;
}

.tab,
dialog article button {
  color: #fff;
  background-color: #dd2c00;
}

dialog article header a,
#app > div > dialog > article > header > a {
  color: #cfa;
}

dialog article header,
dialog article button:hover {
  background-color: #b30202;
  transition: background-color 0.5s ease;
}

dialog article header h2 {
  margin-bottom: 0;
  color: #fff;
}

html[data-theme="dark"] #app > div > dialog > article > section > div.info,
html[data-theme="dark"] #app > div > dialog > article > section > div.info ul li {
  color: var(--contrast) !important;
}

small {
  display: inline-block;
  line-height: 1;
}
</style>
