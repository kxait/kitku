const { isLoggedIn, isAdmin } = require("./auth");

const requireLoggedInUser = (req, res, next) => {
  const ili = isLoggedIn(req);
  if (!ili) {
    res.redirect(303, "/");
    return;
  }

  next();
};

const requireNotLoggedIn = (req, res, next) => {
  const ili = isLoggedIn(req);
  if (ili) {
    res.redirect(303, "/");
    return;
  }

  next();
};

const requireLoggedInAdmin = async (req, res, next) => {
  const ia = await isAdmin(req);
  if (!ia) {
    res.redirect(303, "/");
    return;
  }

  next();
};

module.exports = {
  requireLoggedInAdmin,
  requireLoggedInUser,
  requireNotLoggedIn,
};
