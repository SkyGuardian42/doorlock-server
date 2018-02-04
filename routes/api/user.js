const express = require('express'),
      router  = express.Router(),
      sgMail  = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.get('/', (req, res) => {
  const msg = {
    to: 'admin@lennard.tech',
    from: 'test@malts.me',
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  sgMail.send(msg);
})

module.exports = router;