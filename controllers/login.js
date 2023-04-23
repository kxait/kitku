const { PrismaClient } = require("@prisma/client");
const { getUserId, loginUser } = require("../auth/auth");
const { getLabel } = require("../i18n/i18n-pl");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const loginGet = async (req, res) => {
  res.render("login", {
    redirect: req.headers.referrer || req.headers.referer,
    error: null,
  });
};

const loginPost = async (req, res) => {
  const requestedUser = await prisma.user.findFirst({
    where: {
      email: req.body.email,
    },
  });

  if (requestedUser == null) {
    res.status(400);
    res.render("login", {
      redirect: req.body.redirect,
      error: getLabel("BAD_LOGIN"),
    });
    return;
  }

  if (!bcrypt.compareSync(req.body.password, requestedUser.passwordHash)) {
    res.status(400);
    res.render("login", {
      redirect: req.body?.redirect ?? "/",
      error: getLabel("BAD_LOGIN"),
    });
    return;
  }

  loginUser(res, requestedUser);
  res.redirect(303, req.body.redirect);
};

module.exports = {
  loginGet,
  loginPost,
};
