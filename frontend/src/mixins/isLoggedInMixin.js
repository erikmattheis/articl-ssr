export default {
  data() {
    return {
      currentTime: 0,
    };
  },
  computed: {
    isLoggedInMixin() {
      return this.$store.state.tokens.accessTokenExpires > this.currentTime;
    },
  },
  mounted() {
    this.updateCurrentTime();
  },
  methods: {
    updateCurrentTime() {
      this.currentTime = Date.now();
      const timeUntilTokenExpires = this.$store.state.tokens.accessTokenExpires - this.currentTime;
      if (timeUntilTokenExpires > 0) {
        setTimeout(() => {
          this.updateCurrentTime();
        }, timeUntilTokenExpires);
      }
    },
  },
};

