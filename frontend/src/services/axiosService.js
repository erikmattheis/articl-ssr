import axios from "axios";

let baseURL = "";

if (window.location.hostname === "192.168.1.130" || window.location.hostname === "localhost") {
  baseURL = "http://localhost:5000/v1";
}
else if (window.location.hostname.startsWith("articl-frontend-dev")) {
  baseURL = "https://articl-backend-dev-7be73ad044f7.herokuapp.com/v1";
} else if (window.location.hostname.startsWith("articl-frontend") || window.location.hostname === "articl.net") {
  baseURL = "https://articl-backend-ffc51a8e3a09.herokuapp.com/v1";
}
export default axios.create({
  baseURL,
});
