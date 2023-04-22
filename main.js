const { join } = require("path");
const express = require("express");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const { index } = require("./controllers/index.js");
const { loginGet, loginPost } = require("./controllers/login.js");
const { catImage } = require("./controllers/catImage.js");
const {
  getUserId,
  isLoggedIn,
  getProfileFromCache,
} = require("./auth/auth.js");
const { logout } = require("./controllers/logout.js");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

app.locals.getUserId = getUserId;
app.locals.isLoggedIn = isLoggedIn;
app.locals.getProfileFromCache = getProfileFromCache;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));
app.use(cookieParser());

app.use((req, res, next) => {
  res.locals.req = req;

  next();
});

app.get("/", index);
app.get("/catImage/:catId", catImage);

app.get("/login", loginGet);
app.post("/login", loginPost);
app.get("/logout", logout);

app.listen(port, (req, res) => {
  console.log(`server is running on port ${port}`);
});
