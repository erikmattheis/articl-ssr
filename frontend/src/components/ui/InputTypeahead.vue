<template>
  <template v-if="query">
    <label :for="query">
      <template v-if="labelValue">{{ labelValue }}</template>
      <vue-feather
        v-else
        class="icon"
        size="1.5rem"
        type="search"
        aria-label="Search"
      />
      <input
        :id="query"
        ref="input"
        v-model="stringValue"
        type="text"
        autocomplete="off"
        @keydown.down="down"
        @keydown.up="up"
        @keydown.enter="hit"
        @keydown.esc="removeItems"
        @blur="removeItems"
        @keyup="update"
      />

      <ul>
        <li
          v-for="(item, $index) in items"
          :key="$index"
          :class="{ active: $index === current, 'no-padding': true }"
          @mousedown="hit"
          @mousemove="setActive($index)"
        >
          <span v-text="item" />
        </li>
      </ul>
    </label>
  </template>
</template>
<script>
import { debounce } from "lodash";
import VueFeather from "vue-feather";
import axiosInstance from "~/services/axiosService";

export default {
  components: {
    VueFeather,
  },
  props: {
    src: {
      type: String,
      default: "",
    },
    query: {
      type: String,
      default: "",
    },
    inputValue: {
      type: String,
      default: "",
    },
    labelValue: {
      type: String,
      default: "",
    },
  },
  emits: {
    typeaheadUpdated: null,
  },
  data: () => ({
    items: [],
    current: -1,
    loading: false,
    selectFirst: true,
    stringValue: "",
  }),
  computed: {
    hasItems() {
      return this.items.length > 0;
    },

    isEmpty() {
      return !this.stringValue;
    },

    isDirty() {
      return !!this.stringValue;
    },
  },
  watch: {
    inputValue: {
      handler(val) {
        this.stringValue = val;
      },
    },
  },
  mounted() {
    this.setActive = debounce(this.setActive, 10);

    this.up = debounce(this.up, 200);

    this.update = debounce(this.update, 200);

    this.down = debounce(this.down, 200);

    this.stringValue = this.inputValue;
  },
  methods: {
    async update() {
      try {
        this.cancel();

        if (!this.stringValue) {
          this.$emit("typeaheadUpdated", {
            field: this.query,
            value: "",
          });

          this.removeItems();
        }

        this.loading = true;

        this.hit();

        this.$emit("typeaheadUpdated", {
          field: this.query,
          value: this.stringValue,
        });

        if (this.stringValue.length < 2) {
          return;
        }

        const response = await this.fetchData();

        this.items = response.data.slice(0, 7);

        this.current = -1;

        this.loading = false;

        this.hit();
      } catch (error) {
        this.$store.dispatch("errors/setError", error);
      }
    },

    async fetchData() {
      const params = {
        q: this.stringValue,
      };

      return axiosInstance.get(this.src, {
        params,
      });
    },

    cancel: () => {
      // used to cancel after request made
    },

    removeItems() {
      this.items = [];

      this.loading = false;
    },

    setActive(index) {
      this.current = index;
    },

    activeClass(index) {
      return {
        active: this.current === index,
      };
    },

    hit() {
      if (this.current !== -1 && this.items && this.items[this.current]) {
        this.onHit(this.items[this.current]);
      }
    },

    up() {
      if (this.current > 0) {
        this.current -= 1;
      } else if (this.current === -1) {
        this.current = this.items.length - 1;
      } else {
        this.current = -1;
      }
    },

    down() {
      if (this.current < this.items.length - 1) {
        this.current += 1;
      } else {
        this.current = -1;
      }
    },

    onHit(val) {
      this.stringValue = val;

      this.$emit("typeaheadUpdated", {
        field: this.query,
        value: val,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
input {
  margin-bottom: 0 !important;
}

ul {
  position: absolute;
  z-index: 1;
  width: 100%;
  background-color: var(--background-color);
}

li {
  padding: 0.2rem 0.5rem;
}

label {
  position: relative;
  display: block;
  margin-top: var(--spacing);
}

label .icon {
  position: absolute;
  top: 0.5rem;
  right: 0.4rem;
  opacity: 0.5;
}

.active {
  cursor: pointer;
  background-color: var(--primary);
}

label > :where(input, select, textarea) {
  margin-top: 0;
}
</style>
