<template>
  <ul class="pagination">
    <li class="pagination-item">
      <a
        href="#"
        :class="isInFirstPage ? 'disabled' : ''"
        @click.prevent="onClickFirstPage">First</a>
    </li>
    <li class="pagination-item">
      <a
        href="#"
        :class="isInFirstPage ? 'disabled' : ''"
        @click.prevent="onClickPreviousPage">«</a>
    </li>
    <li
      v-for="page in pages"
      :key="page.id"
      class="pagination-item">
      <a
        href="#"
        :class="{ active: isPageActive(page.name) }"
        @click.prevent="onClickPage(page.name)">{{ page.name }}</a>
    </li>
    <li class="pagination-item">
      <a
        href="#"
        :class="isInLastPage ? 'disabled' : ''"
        @click.prevent="onClickNextPage">»</a>
    </li>
    <li class="pagination-item">
      <a
        href="#"
        :class="isInLastPage ? 'disabled' : ''"
        @click.prevent="onClickLastPage">Last</a>
    </li>
  </ul>
</template>

<script>
export default {
  name: "ThePagination",
  props: {
    numberOfButtons: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  emits: [
    "page-changed",
  ],
  computed: {
    isInFirstPage() {
      return this.currentPage === 1;
    },
    isInLastPage() {
      if (this.totalPages === 0) {
        return true;
      }

      return this.currentPage === this.totalPages;
    },
    startPage() {
      if (this.currentPage === 1) {
        return 1;
      }

      if (this.totalPages < this.numberOfButtons) {
        return 1;
      }

      if (this.currentPage === this.totalPages) {
        return this.totalPages - this.numberOfButtons + 1;
      }

      return this.currentPage - 1;
    },
    endPage() {
      if (this.totalPages === 0) {
        return 1;
      }

      if (this.totalPages < this.numberOfButtons) {
        return this.totalPages;
      }

      return Math.min(
        this.startPage + this.numberOfButtons - 1,
        this.totalPages,
      );
    },
    pages() {
      const range = [];

      for (let i = this.startPage; i <= this.endPage; i += 1) {
        range.push({
          name: i,
          isDisabled: i === this.currentPage,
        });
      }

      return range;
    },
  },
  methods: {
    onClickFirstPage() {
      if (this.isInFirstPage) {
        return;
      }

      this.$emit("page-changed", 1);
    },
    onClickPreviousPage() {
      if (this.isInFirstPage) {
        return;
      }

      this.currentPage -= 1;

      this.$emit("page-changed", this.currentPage);
    },
    onClickPage(page) {
      this.$emit("page-changed", page);
    },
    onClickNextPage() {
      if (this.isInLastPage) {
        return;
      }

      this.currentPage += 1;

      this.$emit("page-changed", this.currentPage);
    },
    onClickLastPage() {
      if (this.isInLastPage) {
        return;
      }

      this.$emit("page-changed", this.totalPages);
    },
    isPageActive(page) {
      return this.currentPage === page;
    },
  },
};
</script>
<style lang="scss" scoped>
.pagination {
  float: right;
  margin: 1rem 0;
  list-style-type: none;

  .pagination-item {
    display: inline-block;
    color: #ddd;

    a {
      margin: 0.5rem;
      text-decoration: none;
    }

    .active {
      padding: 3px 8px;
      font-weight: bold;
      color: #fff !important;
      background-color: --primary;
    }
  }
}
</style>
