<template>
  <div>
    <vue-draggable-next
      :list="categories"
      tag="ul"
      item-key="id"
      handle=".handle"
      ghost-class="ghost"
      @change="onUpdateOrderValues"
    >
      <div v-for="element in categories">
        <categories-list-item
          :category="element"
          class="list-item"
          :tree-level="treeLevel"
        />
      </div>
    </vue-draggable-next>
    <button-new-category />
  </div>
</template>

<script>
import { VueDraggableNext } from "vue-draggable-next";
import { mapGetters } from "vuex";
import CategoriesListItem from "~/components/layout/CategoriesListItem.vue";
import ButtonNewCategory from "~/components/ui/ButtonNewCategory.vue";
import axiosInstance from "~/services/axiosService";

export default {
  name: "CategoriesList",
  components: {
    CategoriesListItem,
    VueDraggableNext,
    ButtonNewCategory,
  },
  data() {
    return {
      drag: false,
    };
  },
  computed: {
    categories: {
      get() {
        return this.$store.resources.categories;
      },
      set(value) {
        this.$store.dispatch("resources/categories", value);
      },
    },
    ...mapGetters({
      categories: "resources/categories",
      treeLevel: "resources/treeLevel",
    }),
  },
  methods: {
    updateOrderValues() {
      try {
        this.categories.forEach((obj, index) => {
          const objRef = obj;

          objRef.order = index;
        });
        this.$store.dispatch("resources/categories", this.categories);
      } catch (error) {
        this.$store.dispatch("errors/setError", error);
      }
    },

    async saveOrderValues() {
      try {
        const order = this.categories.map((obj) => ({
          id: obj.id,
          order: obj.order,
        }));

        await this.saveOrder(order);
      } catch (error) {
        this.$store.dispatch("errors/setError", error);
      }
    },

    async saveOrder(order) {
      this.isLoading = true;

      const result = await axiosInstance({
        method: "POST",
        url: "/categories/order",
        data: {
          order,
        },
      });

      this.isLoading = false;

      return result.data;
    },

    onUpdateOrderValues() {
      this.updateOrderValues();

      this.saveOrderValues();
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: minmax(min-content, 1fr) min-content;
  color: #444;
}

li {
  width: 100%;
  padding: 0 !important;
  overflow-x: hidden;

  a {
    cursor: pointer;
  }
}

li:hover {
  background-color: var(--primary-nav-background);
}
</style>
