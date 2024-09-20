import axios from "axios";

let baseURL = "";

if (
  window.location.hostname === "192.168.1.130" ||
  window.location.hostname === "localhost"
) {
  baseURL = "http://localhost:5000/api/v1";
} else {
  baseURL = "https://dev.herokuapp.com/api/v1";
}

export default axios.create({
  baseURL,
});
