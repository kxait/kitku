const { PrismaClient } = require("@prisma/client");
const { KittyStatus } = require("../common/const");
const prisma = new PrismaClient();

const index = async (req, res) => {
  const kitties = await prisma.kitty.findMany({
    select: {
      name: true,
      description: true,
      id: true,
    },
    where: {
      status: KittyStatus.NOT_ADOPTED,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });

  res.render("index", { kitties });
};

module.exports = {
  index,
};
