import axios from "axios";

export default axios.create({
  baseURL: "http://dropquest.it.kmitl.ac.th:4001",
  headers: {
    "Content-type": "application/json",
  },
});
