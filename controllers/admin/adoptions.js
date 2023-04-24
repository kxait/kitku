const { PrismaClient } = require("@prisma/client");
const { getLabel } = require("../../i18n/i18n-pl");
const { isAdmin, getUserId } = require("../../auth/auth");

const prisma = new PrismaClient();

const adminAdoptions = async (req, res) => {
  const catId = parseInt(req.query.catId);
  let where = {};
  if (catId != null || isNaN(catId)) {
    where = {
      where: {
        kittyId: catId,
      },
    };
  }

  const adoptions = await prisma.adoption.findMany({
    ...where,
    include: {
      kitty: true,
      user: true,
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

  res.render("admin/adoptions", { adoptions: adoptionsHumanFriendly });
};

module.exports = {
  adminAdoptions,
};
