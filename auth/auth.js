const { PrismaClient } = require("@prisma/client");
const { UserType } = require("../common/const");
const prisma = new PrismaClient();

// userIds by auth token
const userIds = {};
// profiles by user id
const profilesCache = {};

const logout = (req, res) => {
  if (!req.cookies || !req.cookies.user) {
    return null;
  }

  if (!userIds[req.cookies.user]) {
    res.cookie("user", null);
    return;
  }

  profilesCache[userIds[req.cookies.user]] = null;
  userIds[req.cookies.user] = null;
};

// will return null if the user is not logged in
const getUserId = (req) => {
  if (!req.cookies || !req.cookies.user) {
    return null;
  }

  if (!userIds[req.cookies.user]) {
    return null;
  }

  return userIds[req.cookies.user];
};

const isLoggedIn = (req) => getUserId(req) != null;

const isAdmin = async (req) => {
  const user = await getUser(req);
  if (user == null) {
    return false;
  }

  if (user.type != UserType.ADMIN) {
    return false;
  }

  return true;
};

const isAdminCache = (req) => {
  const user = getUserId(req);
  if (user == null) {
    return false;
  }

  const cacheUser = profilesCache[user];
  if (cacheUser == null) {
    return false;
  }

  return cacheUser.type == UserType.ADMIN;
};

const getUser = async (req) => {
  const userId = getUserId(req);

  if (userId == null) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  profilesCache[userId] = user;

  return user;
};

const getProfileFromCache = (req) =>
  isLoggedIn(req) ? profilesCache[getUserId(req)] : null;

const loginUser = async (res, user) => {
  const uuid = uuidv4();
  userIds[uuid] = user.id;
  profilesCache[user.id] = user;

  res.cookie("user", uuid);
};

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

module.exports = {
  getUserId,
  getUser,
  loginUser,
  isLoggedIn,
  getProfileFromCache,
  logout,
  isAdmin,
  isAdminCache,
};
