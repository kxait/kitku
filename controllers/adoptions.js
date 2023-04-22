const { PrismaClient } = require("@prisma/client");
const { getUserId } = require("../auth/auth");
const { getLabel } = require("../i18n/i18n-pl");

const prisma = new PrismaClient();

const adoptions = async (req, res) => {
  const userId = getUserId(req);
  if (userId == null) {
    res.redirect(303, "/");
    return;
  }

  const adoptions = await prisma.adoption.findMany({
    where: {
      userId,
    },
    include: {
      kitty: true,
      adoptionEvents: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const adoptionsHumanFriendly = adoptions.map((adoption) => ({
    ...adoption,
    status: getLabel(`ADOPTION_STATUS_${adoption.status}`),
    lastChange: new Date(
      adoption.adoptionEvents[0]?.createdAt ?? ""
    ).toLocaleString(),
  }));

  res.render("adoptions", { adoptions: adoptionsHumanFriendly });
};

module.exports = {
  adoptions,
};
