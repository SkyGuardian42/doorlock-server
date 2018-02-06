const express = require('express'),
      router  = express.Router(),
      admin   = require('firebase-admin'),
      lock    = require('../../lock').open,
      db      = require('../../models');



// opens door
router.post("/", (req, res) => {
  db.sequelize.sync()
    .then(() => db.Log.create({
      user: req.firebaseUser.email,
      action: 'Tür geöffnet'
    }))


  lock.open()
    .then(() => {
      res.json({status: 'success'});
    })
    .catch(e => res.json({error: e}))
});


module.exports = router;