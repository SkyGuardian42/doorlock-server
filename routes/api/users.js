const express = require('express'),
      router  = express.Router(),
      admin   = require('../../firebase');

// lists users
router.post('/', (req, res) => {
  admin.auth().listUsers(1000)
    .then(data => {
      let users = [];
    
      data.users.forEach(user => users.push({
        name: user.displayName,
        admin: user.customClaims.admin,
        uid: user.uid,
        email: user.email
      }));
    
      res.json(users);
    })
    .catch(error => {
      console.log("Error listing users:", error);
    });
})
module.exports = router; 