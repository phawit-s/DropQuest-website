const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    name: String,
    surname: String,
});

const Blog = mongoose.model("users", blogSchema);

module.exports = Blog