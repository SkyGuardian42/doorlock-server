const express = require('express'),
      router  = express.Router(),
      admin   = require('firebase-admin');

const open    = require('./api/open'),
      logs    = require('./api/logs'),
      signup  = require('./api/signup'),
      user    = require('./api/user'),
      users   = require('./api/users')

router.use((req, res, next) => {
  const token = req.body.token
  
  if(req.url === '/signup') 
    next();
  else {
    try {
      admin.auth().verifyIdToken(token)
      .then(user => {
        req.firebaseUser = user
        next()    
      }).catch(e => {
        res.status(400).json({error: e})
      });
    } catch (e) {
      res.status(400).json({error: e})
    } 
  }
})

router.use('/open', open);
router.use('/users', users);
router.use('/user', user);
router.use('/logs', logs);
router.use('/signup', signup);

module.exports = router;