const admin = require('firebase-admin');
// initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "hgo-doorlock",
    clientEmail: "firebase-adminsdk-eu1aj@hgo-doorlock.iam.gserviceaccount.com",
    // private key newline workaround
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  }),
  
  databaseURL: "https://hgo-doorlock.firebaseio.com"
});

module.exports = admin