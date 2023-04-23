const { PrismaClient } = require("@prisma/client");
const { isLoggedIn, getUser } = require("../auth/auth");
const { AdoptionEvent } = require("../common/const");
const prisma = new PrismaClient();

const adoptGet = async (req, res) => {
  if (!req.params.catId || isNaN(parseInt(req.params.catId))) {
    res.status(400);
    res.send("oops");
    return;
  }

  const kittyId = parseInt(req.params.catId);

  const kitty = await prisma.kitty.findUnique({
    where: {
      id: kittyId,
    },
  });

  if (kitty == null) {
    res.status(404);
    res.send("no kitty with this id");
    return;
  }

  const user = await getUser(req);

  res.render("adopt", { kitty, user });
};

const adoptPost = async (req, res) => {
  if (!isLoggedIn(req)) {
    res.redirect(303, "/");
    return;
  }

  if (!req.params.catId || isNaN(parseInt(req.params.catId))) {
    res.status(400);
    res.send("oops");
    return;
  }

  const kittyId = parseInt(req.params.catId);

  const kitty = await prisma.kitty.findUnique({
    where: {
      id: kittyId,
    },
  });

  if (kitty == null) {
    res.status(404);
    res.send("no kitty with this id");
    return;
  }

  const user = await getUser(req);

  const userAdoptions = await prisma.adoption.findMany({
    where: {
      userId: user.id,
    },
  });
  const firstAdoption = userAdoptions.length === 0;

  const adoption = await prisma.adoption.create({
    data: {
      employeeUserId: -1,
      kittyId,
      userId: user.id,
    },
  });

  await prisma.adoptionEvent.create({
    data: {
      type: firstAdoption
        ? AdoptionEvent.CREATED_ADOPTION_NEW_USER
        : AdoptionEvent.CREATED_ADOPTION_EXISTING_USER,
      adoptionId: adoption.id,
      data: JSON.stringify(adoption),
    },
  });

  res.redirect(303, `/adoption/${adoption.id}`);
};

module.exports = {
  adoptGet,
  adoptPost,
};
