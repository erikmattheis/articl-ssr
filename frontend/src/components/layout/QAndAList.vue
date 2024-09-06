<template>
  <div class="tab-content">
    <h2>Q &amp; A</h2>

    <details>
      <summary>Add Q &amp; A</summary>
      <q-and-as-form />
    </details>

    <ul>
      <li v-for="QAndA in QAndAs || []" :key="QAndA.fullText">
        <q-and-a-list-item :passed-q-and-a="QAndA" />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import QAndAListItem from "~/components/layout/QAndAListItem.vue";
import QAndAsForm from "~/components/layout/QAndAsForm.vue";

export default {
  components: {
    QAndAsForm,
    QAndAListItem,
  },
  props: {
    items: {
      default: () => [],
      type: Array,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      QAndAs: "resources/QAndAs",
    }),
  },
};
</script>
