const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const index = async (req, res) => {
  const kitties = await prisma.kitty.findMany({
    select: {
      name: true,
      description: true,
    },
  });

  res.render("index", { kitties });
};

module.exports = {
  index,
};
