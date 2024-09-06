<script>
export default {
  name: "TheArticlsSearchFormDrawyer",

  data() {
    return {
      isSidebarOpen: false,
    }
  },

  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    }
  },

  watch: {
    $route() {
      this.isSidebarOpen = false;
    }
  }
}
</script>

<template>
  <div class="wrapper">
    <aside :vue:is-open="isSidebarOpen">
      <ul class="sidebar-head">
        <li>
          <h1>Articl</h1>
        </li>
        <li>
          <button class="sidebar-toggle"
            :class="isSidebarOpen ? 'toggle-button' : ''">
            <button @click="toggleSidebar">toggle</button>
          </button>
        </li>
      </ul>

      <h4 :transparent="!isSidebarOpen">Menu</h4>

      <ul>
        <li>
          <router-link to="/">

            <Transition name="fade">
              <span v-show="isSidebarOpen">Home</span>
            </Transition>
          </router-link>
        </li>
        <li>
          <router-link to="/about">

            <Transition name="fade">
              <span v-show="isSidebarOpen">About</span>
            </Transition>
          </router-link>
        </li>
        <li>
          <router-link to="/team">

            <Transition name="fade">
              <span v-show="isSidebarOpen">Team</span>
            </Transition>
          </router-link>
        </li>
        <li>
          <router-link to="/contact">

            <Transition name="fade">
              <span v-show="isSidebarOpen">Contact</span>
            </Transition>
          </router-link>
        </li>
      </ul>
    </aside>
  </div>
</template>

<style scoped>
aside {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-block: 1rem;
  transition: all 300ms;
  width: 4rem;
}

aside[vue\:is-open=true] {
  width: 12rem;
}

ul {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-block-end: 1rem;
}

img {
  object-fit: contain;
}

li {
  min-width: fit-content;
  cursor: pointer;
  padding-inline-start: 1rem;
}

li:hover {
  color: #f00;
  background-color: #00f;
}

li a {
  border-right: 0.25rem solid white;
  display: flex;
  align-items: center;
  column-gap: 0.75rem;
  position: relative;
  padding-block: 0.5rem;
}

li a.router-link-exact-active::after {
  content: '';
  position: absolute;
  right: 0;
  width: 0.25rem;
  height: 100%;
  background-color: #0f0;
}


.sidebar-head {
  position: relative;
  padding-block-end: 4rem;
}

.sidebar-toggle {
  padding-inline-start: 1rem;
}

h4 {
  padding-block-end: 1rem;
  padding-inline-start: 1rem;
  user-select: none;
  pointer-events: none;
  opacity: 0.5;
  text-transform: uppercase;
  transition: opacity 300ms;
}

h4[transparent=true] {
  opacity: 0;
}

button {
  cursor: pointer;
  position: absolute;
  transition-duration: 300ms;
  transition-property: transform, left, top;
  left: 0;
  top: 1rem;
  transform: translateX(0%);
}

button.toggle-button {
  left: 100%;
  top: 0;
  transform: translateX(-100%);
}
</style>