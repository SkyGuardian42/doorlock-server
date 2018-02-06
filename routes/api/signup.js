const express = require('express'),
      router  = express.Router(),
      db      = require('../../models'),
      admin   = require('firebase-admin');

// finish signup process
router.post('/', (req, res, next) => {
  const signupToken = req.body.signupToken;
  db.User.findAll({
    where:{ signupToken: signupToken }
  })
  .then(user => {
    if(user.length === 0)
      res.status(403).json({error: 'user doesn\'t exist'})
    else {
      db.User.destroy({
        where: {signupToken: signupToken}
      });
      req.newUser = user[0];
      next();
    }
  });
});

router.post('/', (req, res) => {
  admin.auth().createUser({
    email: req.newUser.email,
    emailVerified: true,
    password: req.body.password,
    displayName: req.newUser.name
  })
  .then(user => {
    admin.auth().setCustomUserClaims(user.uid, {
      admin: req.newUser.admin
    })
    .then(() => res.json({status: 'success'}))
    .catch(e => res.status(400).json({error: e}))
  })
  .catch(e => res.status(400).json({error: e}));
});
            
module.exports = router;