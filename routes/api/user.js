const express = require('express'),
      router  = express.Router()

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
router.get('/', (req, res) => {
  const msg = {
  to: 'skyguardian42@gmail.com',
  from: 'test@example.com',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);
  console.log('sg send')
  res.send('yes')
})

module.exports = router;