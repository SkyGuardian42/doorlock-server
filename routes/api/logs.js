const express = require('express'),
      router  = express.Router(),
      admin   = require('firebase-admin'),
      Sequelize  = require('sequelize');


// shows logs
// token - firebase token
// offset  - 10 log entries, starting from last position
router.post("/", (req, res) => {
  const token  = req.body.token,
        offset = req.body.offset
  
  // takes 10 logs starting from offset, orders them by creation date and strips unneccessary data
  // Log.findAll({ limit: 50, offset: 0, order: [ ['createdAt', 'DESC'] ] })
  Log.findAll({ limit: 50, offset: offset, order: [ ['createdAt', 'DESC'] ] })
    .then(logs => {
      let newLogs = [];
      logs.forEach(log => {
        newLogs.push({
          user: log.user,
          action: log.action,
          createdAt: log.createdAt
        })
      })
      return newLogs;
    })
    .then(logs => res.json(logs))
});

module.exports = router;
