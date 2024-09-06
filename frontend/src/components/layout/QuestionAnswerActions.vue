<template>
  <div class="row-admin-box">
    <a
      role="button"
      tabindex="0"
      @click="deleteAnswer(id)"
      @keyup.enter="deleteAnswer(id)"><div class="sr">Delete answer</div>
      <vue-feather
        size="0.7rem"
        type="delete"
        aria-label="Delete answer" />
    </a>

    <a
      role="button"
      class="handle"
      href="#"><div class="sr">Reorder answer</div>
      <vue-feather
        size="0.7rem"
        type="move"
        aria-label="Drag to reorder" />
    </a>

    <a
      v-if="lastAnswer"
      role="button"
      tabindex="0"
      @click="deleteAnswer(id)"
      @keyup.enter="deleteAnswer(id)"><div class="sr">Delete answer</div>
      <vue-feather
        size="0.7rem"
        type="delete"
        aria-label="Delete answer" />
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
    answer: {
      type: String,
      default: "",
    },
    correct: {
      type: Boolean,
      default: false,
    },
    lastAnswer: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      expanded: false,
    };
  },
  methods: {
    deleteAnswer(id) {
      this.$emit("delete-answer", id);
    },
  },
};
</script>

<style scoped>
.grid {
  white-space:nowrap;
}

.grid a {
  display:inline-block;
}
a {
  align-self: center;
  justify-self: center;
  border:0;
}
</style>
