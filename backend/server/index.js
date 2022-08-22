const express = require("express");
var cors = require("cors");
const Blog = require("../models/models")
const app = express();
const PORT = 3001;

app.use(express.json())
// app.use(express.urlencoded())

const mongoose = require("mongoose");
const database = require("../database/database");

mongoose.Promise = global.Promise;
mongoose.connect(database.mongouri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on("error", () => {
    console.error("Something went wrong in mongodb %s", configs.mongouri);
});
app.use(cors());


app.post('/database', async (req, res) => {
    try {
        await a.save()
    }
    catch (err) {
        err
    }
})

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
