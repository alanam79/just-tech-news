const router = require("express").Router();

const apiRoutes = require("./api");

const homeRoutes = require("./home-routes.js");

// uses the specified middleware function like if we can have /user,
// now this middleware is called for all API’s having /user of this router.
router.use("/api", apiRoutes);
router.use("/", homeRoutes);

router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;
