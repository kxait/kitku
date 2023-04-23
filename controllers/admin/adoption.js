const { PrismaClient } = require("@prisma/client");
const { getUserId } = require("../auth/auth");
const { getLabel } = require("../i18n/i18n-pl");
const prisma = new PrismaClient();

const adoption = async (req, res) => {
  const adoptionId = parseInt(req.params.adoptionId);

  const adoption = await prisma.adoption.findUnique({
    where: {
      id: adoptionId,
    },
    include: {
      kitty: true,
    },
  });

  const userId = getUserId(req);
  if (adoption == null || adoption.userId != userId) {
    res.status(404);
    res.send("no adoption with this id or you do not have access");
    return;
  }

  const events = await prisma.adoptionEvent.findMany({
    where: {
      adoptionId: adoption.id,
    },
  });

  const eventsHumanFriendly = events.map((event) => ({
    type: getLabel(`EVENT_TYPE_${event.type}`),
    createdAt: new Date(event.createdAt).toLocaleString(),
  }));

  let employee = await prisma.user.findUnique({
    where: {
      id: adoption.employeeUserId,
    },
  });
  let employeeName = "";
  if (employee == null) {
    employeeName = getLabel("NO_EMPLOYEE");
  } else {
    employeeName = `${employee.name} ${employee.surname}`;
  }

  adoption.status = getLabel(`ADOPTION_STATUS_${adoption.status}`);

  res.render("adoption", {
    adoption,
    kitty: adoption.kitty,
    events: eventsHumanFriendly,
    employeeName,
  });
};

module.exports = {
  adoption,
};
