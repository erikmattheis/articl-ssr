import { setTitleAndDescription } from "~/services/htmlMetaService";

export default {
  methods: {
    setTitleAndDescriptionMixin(obj) {
      setTitleAndDescription(obj);
    },
  },
};
