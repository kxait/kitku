const requireParams =
  (...params) =>
  (req, res, next) => {
    if (!req.params) {
      res.redirect(303, "/");
      return;
    }

    for (const i of params) {
      if (isNullOrUndefined(req.params[i])) {
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
      if (isNullOrUndefined(req.params[i]) || isNaN(parseInt(req.params[i]))) {
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
      if (isNullOrUndefined(req.body[i])) {
        res.redirect(303, "/");
        return;
      }
    }

    next();
  };

const requireIntBodyFields =
  (...fields) =>
  (req, res, next) => {
    if (!req.body) {
      res.redirect(303, "/");
      return;
    }

    for (const i of fields) {
      if (isNullOrUndefined(req.body[i]) || isNaN(req.body[i])) {
        res.redirect(303, "/");
        return;
      }
    }

    next();
  };

const isNullOrUndefined = (value) => value == null || value == undefined;

module.exports = {
  requireBodyFields,
  requireParams,
  requireIntParams,
  requireIntBodyFields,
};
