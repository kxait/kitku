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
  isAdminCache,
} = require("./auth/auth.js");
const { logout } = require("./controllers/logout.js");
const { cat } = require("./controllers/cat.js");
const { adoptGet, adoptPost } = require("./controllers/adopt.js");
const {
  registerGet,
  registerPost,
  registerSuccess,
} = require("./controllers/register.js");
const { adoption } = require("./controllers/adoption.js");
const { adoptions } = require("./controllers/adoptions.js");
const { adminAdoptions } = require("./controllers/admin/adoptions.js");
const {
  requireLoggedInUser,
  requireLoggedInAdmin,
  requireNotLoggedIn,
} = require("./auth/authMiddleware.js");
const {
  requireIntParams,
  requireBodyFields,
} = require("./common/middleware.js");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

app.locals.getUserId = getUserId;
app.locals.isLoggedIn = isLoggedIn;
app.locals.getProfileFromCache = getProfileFromCache;
app.locals.isAdminCache = isAdminCache;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));
app.use(cookieParser());

app.use((req, res, next) => {
  res.locals.req = req;

  next();
});

app.get("/", index);
app.get("/catImage/:catId", requireIntParams("catId"), catImage);
app.get("/cat/:catId", requireIntParams("catId"), cat);

app.get("/login", requireNotLoggedIn, loginGet);
app.post(
  "/login",
  [requireNotLoggedIn, requireBodyFields("email", "password", "redirect")],
  loginPost
);
app.get("/registrationSuccess", requireNotLoggedIn, registerSuccess);
app.post(
  "/register",
  [
    requireNotLoggedIn,
    requireBodyFields(
      "name",
      "surname",
      "email",
      "password",
      "confirmPassword",
      "phone",
      "street",
      "city",
      "postcode",
      "redirect"
    ),
  ],
  registerPost
);
app.get("/register", requireNotLoggedIn, registerGet);

app.get("/logout", requireLoggedInUser, logout);
app.get(
  "/adopt/:catId",
  [requireLoggedInUser, requireIntParams("catId")],
  adoptGet
);
app.post(
  "/adopt/:catId",
  [requireLoggedInUser, requireIntParams("catId")],
  adoptPost
);
app.get(
  "/adoption/:adoptionId",
  [requireLoggedInUser, requireIntParams("adoptionId")],
  adoption
);
app.get("/adoptions", requireLoggedInUser, adoptions);

app.get("/admin/adoptions", requireLoggedInAdmin, adminAdoptions);

app.listen(port, (req, res) => {
  console.log(`server is running on port ${port}`);
});
