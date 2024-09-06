<template>
  <div>
    <template v-if="show">
      <a
        href="#"
        @click.prevent="
          $emit('show');
          show = !show;
        "
        @keypress.esc="focus()"><p class="sr">Hide password</p>
        <vue-feather
          size="1.2rem"
          type="eye-off"
          aria-label="Hide password" />
      </a>
    </template>
    <template v-if="!show">
      <a
        href="#"
        @click.prevent="
          $emit('show');
          show = !show;
        "
        @keypress.esc="focus()"> <p class="sr">Show password</p>
        <vue-feather
          size="1.2rem"
          type="eye"
          aria-label="Show password" />
      </a>
    </template>
  </div>
</template>

<script>
import VueFeather from "vue-feather";

export default {
  components: {
    VueFeather,
  },
  emits: ["show"],
  data: () => ({
    show: false,
  }),
};
</script>

<style scoped>
.a {
  fill: none;
}

</style>
