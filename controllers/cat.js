const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const cat = async (req, res) => {
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

  res.render("cat", { kitty });
};

module.exports = {
  cat,
};
