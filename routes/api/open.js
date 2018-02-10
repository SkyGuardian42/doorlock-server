const express = require('express'),
      router  = express.Router(),
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
      res.json({status: 'Tür geöffnet'});
    })
    .catch(e => res.json({error: e}))
});


module.exports = router;