const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { getLabel } = require("../i18n/i18n-pl");
const { isLoggedIn } = require("../auth/auth");
const prisma = new PrismaClient();

const registerSuccess = async (req, res) => {
  if (isLoggedIn(req)) {
    res.redirect(303, "/");
    return;
  }

  let redirect = req.query.r;
  if (redirect == null) {
    redirect = "/";
  }

  res.render("registrationSuccess", { redirect });
};

const registerGet = async (req, res) => {
  const redirect = req.params.r || req.headers.referrer || req.headers.referer;
  res.render("register", { error: null, redirect });
};

const registerPost = async (req, res) => {
  if (!req.body) {
    res.status(400);
    res.render("register", { error: getLabel("SYSTEM_ERROR"), redirect: "/" });
    return;
  }

  const form = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body["confirm-password"],
    phone: req.body.phone,
    street: req.body.street,
    city: req.body.city,
    postcode: req.body.postcode,
    redirect: req.body.redirect,
  };

  if (
    [
      "name",
      "surname",
      "email",
      "password",
      "confirmPassword",
      "phone",
      "street",
      "city",
      "postcode",
      "redirect",
    ].some((i) => !form[i])
  ) {
    res.status(400);
    res.render("register", { error: getLabel("SYSTEM_ERROR"), redirect: "/" });
    return;
  }

  const redirect = req.body.redirect;

  if (form.password != form.confirmPassword) {
    res.status(400);
    res.render("register", { error: getLabel("PASSWORDS_NOT_SAME"), redirect });
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: {
        email: form.email,
        phone: form.phone,
      },
    },
    select: {
      email: true,
      phone: true,
    },
  });

  if (existingUser != null) {
    res.status(400);
    res.render("register", {
      error: getLabel("EMAIL_OR_PHONE_EXISTS"),
      redirect,
    });
    return;
  }

  const address = `${form.street}, ${form.city}, ${form.postcode}`;

  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(form.password, salt);

  await prisma.user.create({
    data: {
      name: form.name,
      surname: form.surname,
      email: form.email,
      phone: form.phone,
      address: address,
      passwordHash: hash,
    },
  });

  res.redirect(303, `/registrationSuccess?r=${redirect}`);
};

module.exports = {
  registerPost,
  registerGet,
  registerSuccess,
};
