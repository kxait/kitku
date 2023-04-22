const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const catImage = async (req, res) => {
    if(!req.params.catId || isNaN(parseInt(req.params.catId))) {
        res.status(400);
        res.send("oops");
        return;
    }

    const kittyId = parseInt(req.params.catId);

    const picture = await prisma.kitty.findUnique({
        where: {
            id: kittyId
        },
        select: {
            picture: true
        }
    });

    if(picture == null) {
        res.status(404);
        res.send("no kitty with this id");
        return;
    }

    res.setHeader('content-type', 'image/jpeg');
    res.send(picture.picture);
}

export default {
    catImage
};