<template>
  <div>
    <button @click="triggerError">Trigger Error</button>
  </div>
</template>

<script>
export default {
  name: 'ErrorTest',
  created() {
    // This will throw an intentional error
    console.log(undefinedVariable);
  },
  methods: {
    triggerError() {
      // This will throw an intentional error
      console.log(undefinedVariable);
    },
  },
};
</script>

<style scoped>
/* Some component styles */
</style>
In this example, when the "Trigger Error" button is clicked, it will attempt to access an undefined variable
undefinedVariable, causing a ReferenceError. When running the Vite development server (vite command), the error message
displayed in the console should include the line number where the error occurred in the component file.

Please note that the line number may be slightly different depending on the specific component file and any
modifications you have made to it. The important aspect is that the error message points to the correct line in your own
code.