const { join } = require("path");
const express = require("express");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const multer = require("multer");

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
  requireIntBodyFields,
} = require("./common/middleware.js");
const {
  adminAdoption,
  adminAdoptionChangeStatus,
  adminAdoptionChangeAssigned,
} = require("./controllers/admin/adoption.js");
const {
  adminCats,
  adminCatsPost,
  adminCatDetails,
  adminUpdateCatDetails,
  adminUpdateCatPicture,
  adminUpdateCatsOrder,
} = require("./controllers/admin/cats.js");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

app.locals.getUserId = getUserId;
app.locals.isLoggedIn = isLoggedIn;
app.locals.getProfileFromCache = getProfileFromCache;
app.locals.isAdminCache = isAdminCache;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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
      "confirm-password",
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
app.get(
  "/admin/adoption/:adoptionId",
  [requireLoggedInAdmin, requireIntParams("adoptionId")],
  adminAdoption
);
app.get("/admin/cats", requireLoggedInAdmin, adminCats);

app.get(
  "/api/admin/cats/:catId",
  [requireLoggedInAdmin, requireIntParams("catId")],
  adminCatDetails
);
app.post(
  "/api/admin/adoption/:adoptionId/status",
  [
    requireLoggedInAdmin,
    requireIntParams("adoptionId"),
    requireIntBodyFields("status"),
  ],
  adminAdoptionChangeStatus
);

app.post(
  "/api/admin/adoption/:adoptionId/employee",
  [
    requireLoggedInAdmin,
    requireIntParams("adoptionId"),
    requireIntBodyFields("employeeUserId"),
  ],
  adminAdoptionChangeAssigned
);

const m = multer();

// CREATE cat
app.post(
  "/admin/cats",
  [
    m.fields([{ name: "picture", maxCount: 1 }]),
    requireLoggedInAdmin,
    requireBodyFields("name", "description", "new-cat-status"),
    requireIntBodyFields("new-cat-status"),
  ],
  adminCatsPost
);

// UPDATE cat
app.post(
  "/admin/cats/update",
  [
    m.none(),
    requireLoggedInAdmin,
    requireBodyFields("name", "description", "status", "cat-id"),
    requireIntBodyFields("cat-id", "status"),
  ],
  adminUpdateCatDetails
);

// UPDATE cat pic
app.post(
  "/admin/cats/updatePicture",
  [
    requireLoggedInAdmin,
    m.fields([{ name: "picture", maxCount: 1 }]),
    requireBodyFields("cat-id"),
    requireIntBodyFields("cat-id"),
  ],
  adminUpdateCatPicture
);

// UPDATE cats order
app.post("/api/admin/cats/order", [requireLoggedInAdmin], adminUpdateCatsOrder);

app.listen(port, (req, res) => {
  console.log(`server is running on port ${port}`);
});
