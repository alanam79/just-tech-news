const router = require('express').Router();

const userRoutes = require('./user-routes.js');

// uses the specified middleware function like if we can have /user, 
// now this middleware is called for all API’s having /user of this router.
router.use('/users', userRoutes);

module.exports = router;