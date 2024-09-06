<template>
  <p>
    Please <router-link :to="{ name: 'LoginPage', query: { redirect: $route.path } }">
      log in
    </router-link> to continue.
  </p>
</template>

<script>
export default {
  name: "AlertPleaseLogIn",
};
</script>
