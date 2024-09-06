<template>
  <article>
    <div class="box-placeholder">
      <h2
        class="text-p line"
        :style="{ width: pickWidth(40, 80) + '%' }">
        &nbsp;
      </h2>

      <ul class="nav-tabs">
        <li
          class="text-p line"
          :style="{ width: pickWidth(80, 100) + '%' }">
          &nbsp;
        </li>
        <li
          class="text-p"
          :style="{ width: pickWidth(80, 100) + '%' }">
          &nbsp;
        </li>
        <li
          class="text-p"
          :style="{ width: pickWidth(80, 100) + '%' }">
          &nbsp;
        </li>
        <li
          class="text-p"
          :style="{ width: pickWidth(80, 100) + '%' }">
          &nbsp;
        </li>
        <li
          class="text-p"
          :style="{ width: pickWidth(80, 100) + '%' }">
          &nbsp;
        </li>
        <li
          class="text-p"
          :style="{ width: pickWidth(20, 100) + '%' }">
          &nbsp;
        </li>
      </ul>
    </div>
  </article>
</template>

<script>
export default {
  name: "LoadingPlaceholder",
  methods: {
    pickWidth: (min, max) => Math.floor(Math.random() * (max - min + 1) + min),
  },
};
</script>

<style scoped>
h2,
li {
  text-indent: -999rem;
}
</style>
