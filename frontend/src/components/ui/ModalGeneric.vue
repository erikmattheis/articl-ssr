<template>
  <div
    v-if="errorTitle || successTitle"
    class="modal-container"
    @click.prevent="close()"
    @keyup.enter="close()">
    <dialog
      open
      class="modal"
      @click.stop>
      <article class="max-container-width">
        <header>
          generic
          <vue-feather
            size="20"
            type="x-square"
            aria-label="Close"
            class="close"
            @click.prevent="close()" />
          <h2>{{ errorTitle }}</h2>
        </header>
        <section>
          <div
            class="tab">
            <vue-feather
              size="3rem"
              type="alert-triangle" />
          </div>
          <div class="info">
            <ul>
              <li v-if="errorFileName">
                Error in file: {{ errorFileName }}
              </li>
              <li v-if="errorLineNumber">
                On line: {{ errorLineNumber }}
              </li>
              <li v-if="errorMessage">
                Message: {{ errorMessage }}
              </li>
              <li v-if="errorStack">
                <small>Stack: {{ errorStack }}</small>
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
      errorTitle: "errors/errorTitle",
      errorMessage: "errors/errorMessage",
      errorDetail: "errors/errorDetail",
      errorLineNumber: "errors/errorLineNumber",
      errorFileName: "errors/errorFileName",
      errorStack: "errors/errorStack",
      successTitle: "errors/errorTitle",
      successMessage: "errors/errorMessage",
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
  max-width: 100%;
}

section {
  overflow: auto;
  white-space: nowrap;
}

section div {
  display: flex;
  align-items: center;
  justify-content: center;
  float: left;
}

.tab {
  width: 6rem;
  height: 6rem;
}

#app > div > dialog > article > section > div.info {
  min-width: calc(100% - 6rem);
  min-height: 6rem;
  padding: 1rem;
  color: #dd2c00;
  background-color: #fca;
}
.tab,
dialog article button {
  color: #fff;
  background-color: #dd2c00;
}

.close {
  cursor: pointer;
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

dialog article ul li {
  word-break: break-all;
  white-space: pre-wrap;
}

html[data-theme="dark"] article {
  background-color: var(--background-color);
}

html[data-theme="dark"] #app > div > dialog > article > section > div.info,
html[data-theme="dark"]
#app
> div
> dialog
> article
> section
> div.info
ul
li {
  color: var(--contrast) !important;
}

small {
  display: inline-block;
  line-height: 1;
}
</style>
