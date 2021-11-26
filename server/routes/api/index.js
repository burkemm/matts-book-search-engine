const router = require('express').Router();
const userRoutes = require('./user-routes');
// This is the userRoutes 
router.use('/users', userRoutes);

module.exports = router;
