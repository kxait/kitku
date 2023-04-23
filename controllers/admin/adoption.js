const { PrismaClient } = require("@prisma/client");
const { getUserId } = require("../../auth/auth");
const { getLabel } = require("../../i18n/i18n-pl");
const { AdoptionEvent } = require("../../common/const");
const prisma = new PrismaClient();

const adminAdoption = async (req, res) => {
  const adoptionId = parseInt(req.params.adoptionId);

  const adoption = await prisma.adoption.findUnique({
    where: {
      id: adoptionId,
    },
    include: {
      kitty: true,
      user: true,
    },
  });

  if (adoption == null) {
    res.status(404);
    res.send("no adoption with this id or you do not have access");
    return;
  }

  const adoptionHumanFriendly = {
    ...adoption,
    createdAt: new Date(adoption.createdAt).toLocaleString(),
    status: getLabel(`ADOPTION_STATUS_${adoption.status}`),
  };

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

  res.render("admin/adoption", {
    adoption: adoptionHumanFriendly,
    kitty: adoption.kitty,
    events: eventsHumanFriendly,
    employeeName,
  });
};

const adminAdoptionChangeStatus = async (req, res) => {
  const adoptionId = parseInt(req.params.adoptionId);

  const adoption = await prisma.adoption.findUnique({
    where: {
      id: adoptionId,
    },
  });

  if (adoption == null) {
    res.status(400);
    return;
  }

  const oldStatus = adoption.status;
  const newStatus = req.body.status;

  await prisma.adoption.update({
    where: {
      id: adoptionId,
    },
    data: {
      status: newStatus,
    },
  });

  await prisma.adoptionEvent.create({
    data: {
      type: AdoptionEvent.ADOPTION_STATUS_CHANGED,
      data: JSON.stringify({
        from: oldStatus,
        to: newStatus,
        changedBy: getUserId(req),
      }),
      adoptionId,
    },
  });

  res.status(204);
  res.end();
};

module.exports = {
  adminAdoption,
  adminAdoptionChangeStatus,
};
