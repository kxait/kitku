const { PrismaClient } = require("@prisma/client");
const { getLabel } = require("../../i18n/i18n-pl");

const prisma = new PrismaClient();

const adminCats = async (req, res) => {
  const kitties = await prisma.kitty.findMany({
    include: {
      adoptions: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });

  const kittiesWithAdoptionCount = kitties.map((kitty) => ({
    ...kitty,
    adoptionsCount: kitty.adoptions.length,
    status: getLabel(`KITTY_STATUS_${kitty.status}`),
  }));

  res.render("admin/cats", { kitties: kittiesWithAdoptionCount });
};

const adminCatsPost = async (req, res) => {
  const status = parseInt(req.body["new-cat-status"]);

  await prisma.kitty.create({
    data: {
      name: req.body.name,
      description: req.body.description,
      status: status,
      picture: req.files.picture[0].buffer,
    },
  });

  res.redirect(303, "/admin/cats");
};

const adminCatDetails = async (req, res) => {
  const catId = parseInt(req.params.catId);

  const kitty = await prisma.kitty.findUnique({
    where: {
      id: catId,
    },
    select: {
      name: true,
      description: true,
      status: true,
    },
  });

  if (kitty == null) {
    res.status(404);
    return;
  }

  res.status(200);
  res.send(JSON.stringify(kitty));
};

const adminUpdateCatPicture = async (req, res) => {
  const catId = parseInt(req.body["cat-id"]);
  const picture = req.files.picture[0];

  await prisma.kitty.update({
    where: {
      id: catId,
    },
    data: {
      picture: picture.buffer,
    },
  });

  res.redirect(303, "/admin/cats");
};

const adminUpdateCatDetails = async (req, res) => {
  const catId = parseInt(req.body["cat-id"]);

  const data = {
    name: req.body.name,
    description: req.body.description,
    status: parseInt(req.body.status),
    statusChangedAt: new Date(),
  };

  await prisma.kitty.update({
    where: {
      id: catId,
    },
    data,
  });

  res.redirect(303, "/admin/cats");
};

// body: { catId: order }
const adminUpdateCatsOrder = async (req, res) => {
  const order = req.body;
  for (const i of Object.keys(order)) {
    await prisma.kitty.update({
      where: {
        id: parseInt(i),
      },
      data: {
        displayOrder: order[i],
      },
    });
  }

  res.status(204);
  res.end();
};

module.exports = {
  adminCats,
  adminCatsPost,
  adminCatDetails,
  adminUpdateCatPicture,
  adminUpdateCatDetails,
  adminUpdateCatsOrder,
};
