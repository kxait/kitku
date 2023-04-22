const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const fs = require("fs");
const prisma = new PrismaClient();

const imagesPath = "public/img";

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

  await prisma.kitty.create({
    data: {
      picture: fs.readFileSync(imagesPath + "/slodziak1.jpg"),
      name: "Garnuch",
      description: "Some quick example text to build on the card title and make up the bulk of the card's content.",
    },
  });

  await prisma.kitty.create({
    data: {
      picture: fs.readFileSync(imagesPath + "/slodziak2.jpg"),
      name: "Sarnuch",
      description: "Some quick example text to build on the card title and make up the bulk of the card's content.",
    },
  });

  await prisma.kitty.create({
    data: {
      picture: fs.readFileSync(imagesPath + "/slodziak3.jpg"),
      name: "Jarnuch",
      description: "Some quick example text to build on the card title and make up the bulk of the card's content.",
    },
  });

  await prisma.kitty.create({
    data: {
      picture: fs.readFileSync(imagesPath + "/slodziak4.jpg"),
      name: "Dębica",
      description: "Some quick example text to build on the card title and make up the bulk of the card's content.",
    },
  });

  await prisma.kitty.create({
    data: {
      picture: fs.readFileSync(imagesPath + "/slodziak5.jpg"),
      name: "Cegła w pralce",
      description: "Some quick example text to build on the card title and make up the bulk of the card's content.",
    },
  });

  await prisma.kitty.create({
    data: {
      picture: fs.readFileSync(imagesPath + "/slodziak6.jpg"),
      name: "Rozpierdalator",
      description: "Some quick example text to build on the card title and make up the bulk of the card's content.",
    },
  });

  const kitty7 = await prisma.kitty.create({
    data: {
      picture: fs.readFileSync(imagesPath + "/slodziak7.jpg"),
      name: "Roszpunka",
      description: "najwiekszy slodziak na ziemi :3",
    },
  });

  await prisma.adoption.create({
    data: {
      employeeUserId: admin.id,
      kittyId: kitty7.id,
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
