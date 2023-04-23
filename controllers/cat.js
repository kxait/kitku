const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const cat = async (req, res) => {
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
