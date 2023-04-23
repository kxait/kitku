const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const cache = {};

const catImage = async (req, res) => {
  const kittyId = parseInt(req.params.catId);

  if (cache[kittyId]) {
    res.setHeader("content-type", "image/jpeg");
    res.send(cache[kittyId]);
    return;
  }

  const picture = await prisma.kitty.findUnique({
    where: {
      id: kittyId,
    },
    select: {
      picture: true,
    },
  });

  if (picture == null) {
    res.status(404);
    res.send("no kitty with this id");
    return;
  }

  cache[kittyId] = picture.picture;

  res.setHeader("content-type", "image/jpeg");
  res.send(picture.picture);
};

module.exports = {
  catImage,
};
