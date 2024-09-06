<template>
  <div
    v-if="successTitle"
    class="modal-container"
    @click.prevent="close()"
    @keyup.enter="close()">
    <dialog
      open
      class="modal"
      @click.stop>
      <article>
        <header>
          <a
            href="#close"
            aria-label="Close"
            class="close"
            @click.prevent="close()" />
          <h2>{{ successTitle }}</h2>
        </header>
        <section>
          <div
            class="tab left"
            title="success">
            <vue-feather
              size="3rem"
              type="check"
              aria-label="Check mark" />
          </div>
          <div class="tab right info">
            <small>{{ successMessage }}</small>
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
  computed: {
    ...mapGetters({
      successTitle: "modals/successTitle",
      successMessage: "modals/successMessage"
    }),
  },
  methods: {
    close() {
      this.$store.dispatch("modals/clearSuccess");
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
  background-color: #cfa;
}

.tab,
dialog article button {
  color: #fff;
  background-color: #00701a;
}

dialog article header a,
#app > div > dialog > article > header > a {
  color: #fff;
}

dialog article header,
dialog article button:hover {
  background-color: #43a047;
  transition: background-color 0.5s ease;
}

dialog article header h2 {
  color: #fff;
}

dialog article ul li {
  word-break: break-all;
  white-space: pre-wrap;
}

html[data-theme="dark"] .modal-container {
  background-color: black;
}

html[data-theme="dark"] .modal {
  background-color: black;
}

html[data-theme="dark"] article {
  background-color: #141e26;
}

html[data-theme="dark"] #app > div > dialog > article > section > div.info,
html[data-theme="dark"] #app > div > dialog > article > section > div.info ul li {
  color: black !important;
  background-color: #cfa;
}

small {
  display: inline-block;
  line-height: 1;
}
</style>
