const requireParams =
  (...params) =>
  (req, res, next) => {
    if (!req.params) {
      res.redirect(303, "/");
      return;
    }

    for (const i of params) {
      if (!req.params[i]) {
        res.redirect(303, "/");
        return;
      }
    }

    next();
  };

const requireIntParams =
  (...params) =>
  (req, res, next) => {
    if (!req.params) {
      res.redirect(303, "/");
      return;
    }

    for (const i of params) {
      if (!req.params[i] || isNaN(parseInt(req.params[i]))) {
        res.redirect(303, "/");
        return;
      }
    }

    next();
  };

const requireBodyFields =
  (...fields) =>
  (req, res, next) => {
    if (!req.body) {
      res.redirect(303, "/");
      return;
    }

    for (const i of fields) {
      if (!req.body[i]) {
        res.redirect(303, "/");
        return;
      }
    }

    next();
  };

module.exports = {
  requireBodyFields,
  requireParams,
  requireIntParams,
};
