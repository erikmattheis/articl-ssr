<template>
  <article>
    <h1 v-if="method === 'PATCH'">
      Articl.net User: {{ nameFirst }} {{ nameLast }}<br />
    </h1>
    <h1 v-else>Create Account</h1>
    <form>
      <template v-if="!isLoading">
        <label for="username"
          >Username
          <input
            id="username"
            v-model="username"
            type="text"
            name="username"
            autocomplete="off"
            :aria-invalid="usernameInvalid"
            maxlen="64"
            @keyup="removeUsernameWhiteSpace"
            @focus="usernameFocused"
            @blur="elementBlurred"
        /></label>

        <label v-if="!isLoggedInMixin" for="password"
          >Password
          <small v-if="passwordInvalid" class="left-space">
            Must be 12 or more characters using characters from at least two of
            these groups: uppercase letters, lowercase letters, digits and
            special characters.
          </small>

          <div class="toggle-password">
            <input
              id="password"
              v-model="password"
              :type="passwordType"
              :aria-invalid="passwordInvalid"
              maxlen="64"
              name="password"
              autocomplete="new-password"
            />
            <a href @click.prevent="togglePassword()"
              ><vue-feather
                size="1.2rem"
                :type="
                  (passwordType =
                    passwordType === 'password' ? 'eye' : 'eye-off')
                "
                aria-label="Hide password"
            /></a>
          </div>
        </label>
        <label v-if="!isLoggedInMixin" for="password2"
          >Confirm password
          <div class="toggle-password">
            <input
              id="password2"
              v-model="password2"
              :type="password2Type"
              maxlen="64"
              name="password2"
              :aria-invalid="password2Invalid"
              autocomplete="new-password"
            />
            <vue-feather
              size="1.2rem"
              :type="
                (password2Type =
                  password2Type === 'password' ? 'eye' : 'eye-off')
              "
              aria-label="Hide password"
              @click.prevent="togglePassword2()"
            />
          </div>
        </label>

        <fieldset class="grid">
          <div>
            <label for="nameFirst"
              >First Name
              <input
                id="nameFirst"
                v-model="nameFirst"
                type="text"
                name="nameFirst"
                :aria-invalid="nameFirstInvalid"
                autocomplete="given-name"
                @blur="elementBlurred"
            /></label>
          </div>
          <div>
            <label for="nameLast"
              >Last Name
              <input
                id="nameLast"
                v-model="nameLast"
                type="text"
                name="nameLast"
                :aria-invalid="nameLastInvalid"
                autocomplete="family-name"
                @blur="elementBlurred"
            /></label>
          </div>
        </fieldset>

        <label for="email"
          >Email
          <input
            id="email"
            v-model="email"
            type="text"
            name="email"
            :aria-invalid="emailInvalid"
            autocomplete="email"
            @blur="elementBlurred"
        /></label>

        <label for="position"
          >Current position
          <select
            id="position"
            v-model="position"
            name="position"
            :aria-invalid="positionInvalid"
            @blur="elementBlurred"
          >
            <option disabled value="">Please select one</option>
            <option value="Student">Student</option>
            <option value="Resident">Resident</option>
            <option value="Physician">Physician</option>
            <option value="Fellow">Fellow</option>
            <option value="Allied Healthcare Profession">
              Allied Healthcare Profession
            </option>
          </select>
        </label>
        <label for="education"
          >School
          <input
            id="education"
            v-model="education"
            type="text"
            name="education"
            :aria-invalid="educationInvalid"
            autocomplete="education"
            @blur="elementBlurred"
        /></label>
        <label for="institution"
          >Current Institution
          <input
            id="institution"
            v-model="institution"
            type="text"
            name="institution"
            :aria-invalid="institutionInvalid"
            autocomplete="organization"
            @blur="elementBlurred"
        /></label>
        <label for="city"
          >City
          <input
            id="city"
            v-model="city"
            type="text"
            name="city"
            :aria-invalid="cityInvalid"
            autocomplete="address-level2"
            @blur="elementBlurred"
        /></label>
        <select-countries
          id="country"
          :country="country"
          :aria-invalid="countryInvalid"
          @change-country="changeCountry"
          @focusout="elementBlurred"
        />

        <button
          id="Update"
          type="submit"
          :aria-busy="buttonDisabled"
          :disabled="buttonDisabled"
          @click.prevent="submitForm"
        >
          <span v-if="!buttonDisabled && method === 'PATCH'"
            >Update Account</span
          >
          <span v-else-if="!buttonDisabled">Create Account</span>
        </button>
        <router-link
          v-if="isLoggedInMixin"
          :to="{ name: 'ChangePasswordLoggedIn' }"
        >
          Change password
        </router-link>
        <a
          v-if="isLoggedInMixin"
          href
          class="right"
          @keyup="logout()"
          @click="logout()"
        >
          Log out
        </a>
      </template>
    </form>
  </article>
</template>

<script>
import selectCountries from "~/components/ui/SelectCountries.vue";
import theButtonToggleHidden from "~/components/ui/TheButtonToggleHidden.vue";
import { scoreChars, validateEmail } from "~/services/userService";
import axiosInstance from "~/services/axiosService";
import isLoggedInMixin from "~/mixins/isLoggedInMixin";
import VueFeather from "vue-feather";

export default {
  name: "UsersPage",
  components: {
    selectCountries,
    theButtonToggleHidden,
    VueFeather,
  },

  data: () => ({
    focusedElements: [],
    id: "",
    username: "",
    password: "",
    passwordType: "password",
    password2: "",
    password2Type: "password",
    nameFirst: "",
    nameLast: "",
    email: "",
    position: "",
    education: "",
    institution: "",
    city: "",
    country: "",
    method: "PATCH",
    formActionUrl: "",
    buttonDisabled: false,
    isLoading: true,
    errorMessage: "",
    result: "",
  }),
  computed: {
    slug() {
      return this.$route.query.slug || "0";
    },
    usernameInvalid() {
      if (this.focusedElements.indexOf("username") === -1) {
        return null;
      }
      return this.username.length < 3;
    },
    passwordInvalid() {
      if (this.focusedElements.indexOf("password") === -1) {
        return null;
      }

      return this.scoreChars(this.password) < 2;
    },
    password2Invalid() {
      if (this.focusedElements.indexOf("password2") === -1) {
        return null;
      }
      return (
        (this.password2.length &&
          this.password.length > 11 &&
          this.password2 !== this.password) ||
        this.scoreChars(this.password2) < 2
      );
    },
    nameFirstInvalid() {
      if (this.focusedElements.indexOf("nameFirst") === -1) {
        return null;
      }
      return this.nameFirst.length === 0;
    },
    nameLastInvalid() {
      if (this.focusedElements.indexOf("nameLast") === -1) {
        return null;
      }
      return this.nameLast.length === 0;
    },
    emailInvalid() {
      if (this.focusedElements.indexOf("email") === -1) {
        return null;
      }
      return !this.validateEmail(this.email);
    },
    educationInvalid() {
      if (this.focusedElements.indexOf("education") === -1) {
        return null;
      }
      return this.education.length === 0;
    },
    positionInvalid() {
      if (this.focusedElements.indexOf("position") === -1) {
        return null;
      }
      return this.position.length === 0;
    },
    institutionInvalid() {
      if (this.focusedElements.indexOf("institution") === -1) {
        return null;
      }
      return this.institution.length === 0;
    },
    cityInvalid() {
      if (this.focusedElements.indexOf("city") === -1) {
        return null;
      }
      return this.city.length === 0;
    },
    countryInvalid() {
      if (this.focusedElements.indexOf("country") === -1) {
        return null;
      }
      return this.country.length === 0;
    },
  },
  mounted() {
    if (this.isLoggedInMixin) {
      this.method = "GET";

      this.fetchData();

      this.formActionUrl = "/users";

      this.method = "PATCH";
    } else {
      this.method = "POST";

      this.formActionUrl = "/auth/register";

      this.isLoading = false;
    }

    this.setTitleAndDescriptionMixin({
      titleHtml: "Articl.net User Account",
    });
  },
  mixins: [isLoggedInMixin],
  methods: {
    togglePassword() {
      this.passwordType =
        this.passwordType === "password" ? "text" : "password";
    },
    togglePassword2() {
      this.password2Type =
        this.password2Type === "password" ? "text" : "password";
    },
    async logout() {
      await this.$store.dispatch("users/logout");
    },
    elementBlurred(e) {
      console.log("blurred", e.target.name);
      if (this.focusedElements.indexOf(e.target.name) === -1) {
        this.focusedElements.push(e.target.name);
      }
    },
    async fetchData() {
      try {
        this.isLoading = true;

        const result = await this.getMe();

        /* Object.assign(this, result); */

        this.id = result.id ? result.id : "";

        this.username = result.username ? result.username : "";

        this.nameFirst = result.nameFirst ? result.nameFirst : "";

        this.nameLast = result.nameLast ? result.nameLast : "";

        this.email = result.email ? result.email : "";

        this.education = result.education ? result.education : "";

        this.position = result.position ? result.position : "";

        this.institution = result.institution ? result.institution : "";

        this.city = result.city ? result.city : "";

        this.state = result.state ? result.state : "";

        this.country = result.country ? result.country : "";

        this.theme = result.theme !== "dark" ? "light" : "dark";

        this.fontSize = result.fontSize ? result.fontSize : "";

        this.setTitleAndDescriptionMixin({
          titleHtml: `Articl.net User ${this.username}`,
        });
      } catch (error) {
        this.$store.dispatch("errors/setError", error);
      } finally {
        this.isLoading = false;
      }
    },

    async getMe() {
      const result = await axiosInstance({
        method: "GET",
        url: "/users/me",
      });

      return result.data;
    },

    resetFormErrors() {
      this.result = null;
    },
    changeCountry(country) {
      this.country = country;
    },

    checkForm() {
      const errorMessages = [];

      if (this.method === "POST") {
        if (this.usernameInvalid) {
          errorMessages.push(
            "Your username must be at least three characters long."
          );
        }

        if (this.passwordInvalid) {
          errorMessages.push(
            "Password must be at least eight chanacters and contain an upper case letter, a lower case letter and a digit."
          );
        }
        if (this.password2Invalid) {
          errorMessages.push("Please conform (re-enter) a password.");
        }
      }
      if (this.nameFirstInvalid) {
        errorMessages.push("Please enter your first name.");
      }
      if (this.nameLastInvalid) {
        errorMessages.push("Please enter your last name.");
      }
      if (this.emailInvalid) {
        errorMessages.push("Please enter a valid email address.");
      }
      if (this.educationInvalid) {
        errorMessages.push("Please enter your education.");
      }
      if (this.positionInvalid) {
        errorMessages.push("Please enter your position.");
      }
      if (this.institutionInvalid) {
        errorMessages.push("Please enter your institution.");
      }
      if (this.cityInvalid) {
        errorMessages.push("Please enter your city.");
      }
      if (this.countryInvalid) {
        errorMessages.push("Please enter your country.");
      }
      if (errorMessages.length) {
        this.errorMessage = errorMessages.join(",");
        this.$store.dispatch("errors/setError", this.errorMessage);
      }

      return !errorMessages.length;
    },

    async submitForm() {
      try {
        this.resetFormErrors();

        if (this.checkForm() === true) {
          this.buttonDisabled = true;

          const data = {
            nameFirst: this.nameFirst,
            nameLast: this.nameLast,
            email: this.email,
            education: this.education,
            position: this.position,
            institution: this.institution,
            city: this.city,
            country: this.country,
          };

          if (this.method === "POST") {
            data.username = this.username;
            data.password = this.password;
          }

          const result = await axiosInstance({
            method: this.method,
            url: `${this.formActionUrl}/${this.id}`,
            data,
          });

          if (result.data) {
            this.result = result.data;

            if (this.method === "POST") {
              this.$store.dispatch("modals/setSuccessTitle", "User Created");

              this.$store.dispatch(
                "modals/setSuccessMessage",
                `Please click on the link in the verification email that was sent to ${this.email}.`
              );

              this.$router.push("/");
              this.$router.push({
                name: "ArticlsList",
                params: { slug, articlType },
              });
            } else {
              this.$store.dispatch("modals/setSuccessTitle", "User Updated");

              this.$store.dispatch(
                "modals/setSuccessMessage",
                "Your account information was successfully updated."
              );
            }
          } else {
            this.$store.dispatch("errors/setError", "Unknown response.");
          }
        }
      } catch (error) {
        this.$store.dispatch("errors/setError", error);
      } finally {
        this.buttonDisabled = false;
      }
    },
    removeUsernameWhiteSpace() {
      this.username = this.username.replace(/\s/g, "");
    },
    usernameFocused() {
      if (this.isLoggedInMixin === true) {
        this.$store.dispatch(
          "errors/setError",
          "You cannot change your username."
        );
      }
    },
    scoreChars,
    validateEmail,
  },
};
</script>

<style scoped>
nav ul {
  display: block;
}
</style>
