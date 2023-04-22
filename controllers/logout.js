const { logout: authLogout } = require("../auth/auth");

const logout = async (req, res) => {
  authLogout(req, res);

  const redirectLocation = req.headers.referrer || req.headers.referer || "/";

  res.redirect(303, redirectLocation);
};

module.exports = {
  logout,
};
