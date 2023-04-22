const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

const getSalt = (s) => ``;

async function main() {
  userSalt = await bcrypt.genSalt();
  userHash = await bcrypt.hash(`user`, userSalt);

  const user = await prisma.user.create({
    data: {
      name: "Andrzej",
      surname: "Adopcyjny",
      email: "user@user.pl",
      phone: "+48213769420",

      passwordHash: userHash,
      passwordSalt: userSalt,
    },
  });

  adminSalt = await bcrypt.genSalt();
  adminHash = await bcrypt.hash(`admin`, adminSalt);

  const admin = await prisma.user.create({
    data: {
      name: "Artur",
      surname: "Adminowy",
      email: "admin@admin.pl",
      phone: "+48420692137",

      passwordHash: adminHash,
      passwordSalt: adminSalt,
    },
  });

  const kitty1 = await prisma.kitty.create({
    data: {
      picture: Buffer.from([]),
      name: "Roszpunka",
      description: "najwiekszy slodziak na ziemi :3",
    },
  });

  await prisma.adoption.create({
    data: {
      employeeUserId: admin.id,
      kittyId: kitty1.id,
      userId: user.id,
    },
  });
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
