const express = require('express'),
      router  = express.Router(),
      db      = require('../../models'),
      sgMail  = require('@sendgrid/mail'),
      fb      = require('../../firebase');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// adds a user
// name  - name of the user
// email - email of the user
// admin - boolean if admin or not
router.put('/', (req, res, next) => {
  const name  = req.body.name,
        email = req.body.email,
        admin = req.body.admin;
  
  let nameRegex = /^(([A-Z]|[\u00C0-\u00DF])([a-z]|[\u00E0-\u00FF]|\u00DF)+ ?){2,}$/g,
      emailRegex = /^.+@.+\..+$/g;
  
  // Validate user input
  if(!nameRegex.test(name))
    res.status(400).json({error: 'Name im falschen Format'});
  else if(!emailRegex.test(email)) 
    res.status(400).json({error: 'Email im falschen Format'});
  else
    next();
})

router.put('/', (req, res) => {
  const name  = req.body.name,
        email = req.body.email,
        admin = req.body.admin;
    
  // generate random signup token
  let signupToken    = '',
      possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i++)
    signupToken += possible.charAt(Math.floor(Math.random() * possible.length));

  // make database entry
  db.sequelize.sync()
  .then(() => db.User.create({
    name: name,
    email: email,
    signupToken: signupToken,
    admin: admin
  }))
  
  // create email data
  const msg = {
    to: email,
    from: 'doorlock@doorlock.malts.me',
    subject: 'Registrierung HGO Türschloss',
    text: `Du wurdest für das HGO Türschloss freigeschaltet!
          Du kannst deine Registrierung unter https://doorlock.glitch.me?signup=${signupToken} abschließen.`,
    html: `<h1>Du wurdest für das HGO Türschloss freigeschaltet!</h1>
          <h3>Du kannst deine Registrierung <a href="https://doorlock.glitch.me?signup=${signupToken}">hier</a> abschließen</h3>`,
  };
  
  // send email to new user
  sgMail.send(msg);
  
  res.status(201).json({status: 'Nutzer eingeladen'});
})

// changes a users role
// uid   - target user uid
// admin  - admin or not 
router.patch('/', (req, res) => {
  const uid   = req.body.uid,
        admin = req.body.admin;
  
  fb.auth().setCustomUserClaims(uid, {admin: admin})
  .then(() => res.json({status: 'Rolle des Nutzers zu ' + (admin? 'Admin' : 'Nutzer') + ' geändert'}))
  .catch(e => res.status(400).json({error: e}))
})

// deletes a user
// uid - uid of user to delete
router.delete('/', (req, res) => {
  const uid = req.body.uid;
  fb.auth().deleteUser(uid)
  .then(() => {
    res.json({status: 'Nutzer gelöscht'});
  })
  .catch(e => {
    res.status(400).json({error: e});
  })
})

module.exports = router;