<template>
  <form>
    <label for="question"
      >Question
      <textarea id="question" v-model="QandAs.question" name="question" />
    </label>
    <draggable-items
      v-model="QandAs.answers"
      tag="li"
      item-key="id"
      handle=".handle"
      ghost-class="ghost"
      @change="onUpdateAnswersOrderValues"
    >
      <template #item="{ element, index }">
        <div class="grid grid-answer">
          <label :for="`answer${index}`"
            >Answer
            <input
              type="text"
              :id="`answer${index}`"
              v-model="element.answer"
              :name="`answer${index}`"
              autocomplete="off"
          /></label>
          <label :for="`nameLast${index}`"
            >Correct<br />
            <input
              type="checkbox"
              :id="`correct${index}`"
              v-model="element.correct"
              :name="`correct${index}`"
          /></label>
          <question-answer-actions @remove="removeAnswer" @add="addAnswer" />
          <a
            role="button"
            @click.prevent="removeAnswer(index)"
            @keyup.enter.prevent="removeAnswer(index)"
            tabindex="0"
            >Remove Answer</a
          >
          <a
            v-if="index === QandAs.answers.length + 1"
            role="button"
            @click.prevent="addAnswer()"
            @keyup.enter.prevent="removeAnswer(index)"
            tabindex="0"
            >Add Answer</a
          >
        </div>
      </template>
    </draggable-items>

    <div class="grid">
      <div class="grid-right">
        <button
          :aria-busy="buttonDisabled"
          @click.prevent="
            $router.push({
              name: 'TabNotes',
              params: { slug: $route.params.slug },
            })
          "
        >
          Cancel
        </button>

        <button
          :aria-disabled="buttonDisabled"
          :aria-busy="buttonDisabled"
          @click.prevent="submitForm()"
        >
          {{ !QandAs?.id ? "Create" : "Edit" }} QandAs
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import axiosInstance from "~/services/axiosService";
import QuestionAnswerActions from "~/components/layout/QuestionAnswerActions.vue";

export default {
  props: {
    passedQandAs: {
      type: Object,
      default: () => ({
        QAndAs: "",
        answers: [
          {
            id: null,
            answer: "",
            correct: false,
          },
          {
            id: null,
            answer: "",
            correct: false,
          },
        ],
      }),
    },
  },
  components: {
    QuestionAnswerActions,
  },
  emits: ["QandAs-updated"],
  data() {
    return {
      QandAs: {},
      isLoading: false,
      formAction: false,
      QandAsCreated: false,
      buttonDisabled: false,
    };
  },

  mounted() {
    this.QandAs = this.passedQandAs;

    if (!this.QandAs?.id) {
      this.formAction = "Create";
    } else {
      this.question = this.QandAs.question;
      this.questionOriginal = this.QandAs.question;
      this.formAction = "Edit";
    }

    this.setTitleAndDescriptionMixin({
      titleHtml: `${this.formAction} Q and A`,
    });
  },
  methods: {
    addAnswer() {
      this.QandAs.answers.push({
        answer: "",
        correct: false,
      });
    },
    removeAnswer(index) {
      this.QandAs.answers.splice(index, 1);
    },
    cancel() {
      this.question = this.questionOriginal;
      this.$router.push({ name: "TabQandAs" });
    },
    resetFormErrors() {
      this.errorMessage = "";
    },
    checkForm() {
      this.resetFormErrors();

      let passed = true;

      if (this.question === "") {
        this.errorMessage = "Please enter the text of the QandAs.";

        passed = false;
      }

      return passed;
    },

    async submitForm() {
      let url = "/QandAs/";

      const id = this.QandAs?.id;
      const data = {
        question: this.question,
        answers: this.answers,
      };

      if (id) {
        url = `/QandAs/${id}`;
      } else {
        data.slug = this.$route.params.slug;
      }

      try {
        this.resetFormErrors();

        if (this.checkForm() === true) {
          this.buttonDisabled = true;

          const verb = this.QandAs?.id ? "PATCH" : "POST";

          const result = await axiosInstance({
            method: verb,
            url,
            data,
          });

          const resultVerb = this.QandAs?.id ? "PATCH" : "POST";

          this.setTitleAndDescriptionMixin({
            titleHtml: `${resultVerb} Q and A`,
          });

          this.QandAsCreated = true;
          this.$emit("QandAs-updated", result.data);
          if (id) {
            this.$router.push({
              name: "editQandAsuccess",
              params: { id: this.QandAs.id },
            });
          } else {
            this.$router.push({
              name: "TabQandAs",
              params: { slug: this.$route.params.slug },
            });
          }
        } else {
          this.$store.dispatch("errors/setError", this.errorMessage);
        }
      } catch (error) {
        this.$store.dispatch("errors/setError", error);
      } finally {
        this.buttonDisabled = false;
      }
    },
    updateAnswerOrderValues() {
      try {
        this.QandAs.answers.forEach((obj, index) => {
          const objRef = obj;

          objRef.order = index;
        });
      } catch (error) {
        this.$store.dispatch("errors/setError", error);
      }
    },
    async saveAnswerOrderValues() {
      try {
        const order = this.QandAs.answers.map((obj) => ({
          id: obj.id,
          order: obj.order,
        }));

        await this.saveAnswersOrder(order);
      } catch (error) {
        this.$store.dispatch("errors/setError", error);
      }
    },

    async saveAnswersOrder(order) {
      this.isLoading = true;

      const result = await axiosInstance({
        method: "POST",
        url: "/answers/order",
        data: {
          order,
        },
      });

      this.isLoading = false;

      return result.data;
    },

    onUpdateAnswersOrderValues() {
      this.updateAnswerOrderValues(this.answerTypeCurrent);

      this.saveAnswerOrderValues(this.answerTypeCurrent);
    },
  },
};
</script>

<style scoped>
button,
.a {
  margin-top: var(--nav-link-spacing-vertical);
  margin-right: var(--nav-link-spacing-horizontal);
}

form {
  background-color: var(--muted-border-color);
  padding: var(--form-element-spacing-horizontal) !important;
}

textarea {
  width: 100%;
}

.grid-answer {
  grid-template-columns: min-content min-content min-content;
}
</style>
