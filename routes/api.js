const express = require('express'),
      router  = express.Router();

const open    = require('./api/open'),
      logs    = require('./api/logs'),
      user    = require('./api/user'),
      users   = require('./api/users')

router.use('/open', open);
router.use('/users', users);

router.use('/user', user);
router.use('/logs', logs);

module.exports = router;

// router.use('/open', open)