import axios from "axios";

export default axios.create({
  baseURL: "http://dropquest.it.kmitl.ac.th:8002",
  headers: {
    "Content-type": "application/json",
  },
});
