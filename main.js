const { join } = require("path");
const express = require("express");
const { index } = require("./controllers/index.js");
const { cats } = require("./controllers/cats.js");
const { catImage } = require("./controllers/catImage.js");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

app.get("/", index);
app.get("/kotki", cats);
app.get("/catImage/:catId", catImage);

app.use(express.urlencoded({ extended: false }));
app.use(express.static(join(__dirname, "public")));

app.listen(port, (req, res) => {
  console.log(`server is running on port ${port}`);
});
