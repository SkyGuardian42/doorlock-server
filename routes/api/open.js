const express = require('express'),
      router  = express.Router(),
      admin   = require('firebase-admin'),
      Sequelize  = require('sequelize');

// opens door
// token - firebase token
router.post("/", (req, res) => {
  admin.auth().verifyIdToken(req.body.token)
  .then(user => {
    sequelize.sync()
      .then(() => Log.create({
        user: user.email,
        action: 'Tür geöffnet'
      }))
    
    
    io.to(doorStatus.id).emit('open');
    
    res.send({status: 'success'});
  }).catch(error => {
    res.send({status: 'error', error: error});
  });
});

module.exports = router;