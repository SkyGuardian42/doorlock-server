const express = require('express'),
      router  = express.Router(),
      db      = require('../../models')

// shows logs
// offset - date from which to start looking  
// takes 50 log entries starting from the offset & orders them by creation date
router.post("/", (req, res) => {
  const offset = req.body.offset;
  
  db.Log.findAll({
    limit: 35,
    where:{
      createdAt: {
        [db.Sequelize.Op.lt]: offset ? offset : db.Sequelize.NOW()
      }
    },
    order: [ ['createdAt', 'DESC'] ],
    attributes: ['createdAt', 'user', 'action']
  })
  .then(logs => res.json(logs))
});

module.exports = router;