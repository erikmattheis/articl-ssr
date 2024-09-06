<template>
  <section>
    <div
      class="tab"
      title="success">
      <vue-feather
        size="60"
        type="check"
        aria-label="Check mark" />
    </div>
    <div class="info">
      <aside>{{ successMessage }}</aside>
    </div>
  </section>
</template>

<script>
import VueFeather from "vue-feather";

export default {
  components: {
    VueFeather,
  },
  props: {
    successMessage: {
      type: String, default: "",
    },
  },
  data: () => ({
    title: "",
  }),
};
</script>

<style scoped>

section {
  overflow: auto;
}

section div {
  display: flex;
  align-items: center;
  justify-content: center;
  float: left;
}

#app > main > article > section > div.info,
#app > main > article > section > div.info > aside {
  min-width: calc(100% - 6rem) !important;
}

.tab {
  width: 4rem;
  height: 4rem;
  background: #8bc34a;
}

.info {
  height: 4rem;
  padding: 0 1rem;
  color: black;
  background: #dcedc8;
}

</style>
