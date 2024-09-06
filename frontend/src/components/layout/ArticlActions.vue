<template>
  <div class="row-admin-box">
    <router-link
      role="button"
      :to="{ name: 'editArticl', params: { editId: id } }">
      <vue-feather
        size="0.7rem"
        type="edit"
        aria-label="Edit articl" />
    </router-link>

    <router-link
      role="button"
      :to="{ name: 'DeleteArticlPage', params: { id } }">
      <vue-feather
        size="0.7rem"
        type="delete"
        aria-label="Delete articl" />
    </router-link>

    <a
      role="button"
      class="handle"
      href="#">
      <div class="sr">Reorder articl</div>
      <vue-feather
        size="0.7rem"
        type="move"
        aria-label="Drag to reorder" />
    </a>
  </div>
</template>

<script>
import VueFeather from "vue-feather";

export default {
  components: {
    VueFeather,
  },
  props: {
    id: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      expanded: false,
    };
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
