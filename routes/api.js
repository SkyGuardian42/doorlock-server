const express = require('express'),
      router  = express.Router(),
      admin   = require('../firebase');

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
        req.firebaseUser = user;
        if(user.admin) 
          next()
        else if (req.url == '/open')
          next();
        else
          res.status(403).json({error: 'forbidden'});  
      }).catch(e => {
        console.log(e);
        res.status(400).json({error: e});
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({error: e});
    } 
  }
})

router.use('/open', open);
router.use('/users', users);
router.use('/user', user);
router.use('/logs', logs);
router.use('/signup', signup);

module.exports = router;