const express = require('express'),
      router  = express.Router(),
      admin   = require('firebase-admin');

router.post('/', (req, res) => {
  admin.auth().listUsers(1000)
    .then(function(listUsersResult) {
      // if (listUsersResult.pageToken) {
      //   // List next batch of users.
      //   listAllUsers(listUsersResult.pageToken)
      // }
    res.json(listUsersResult)  
  })
    .catch(function(error) {
      console.log("Error listing users:", error);
    });
})
module.exports = router;