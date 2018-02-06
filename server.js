// SERVER PROTOTYPE
const express    = require('express'),
      bodyParser = require('body-parser'),
      app        = express(),
      server     = require('http').Server(app),
      io         = require('socket.io')(server),
      door       = require('./lock').listen(io),
      admin      = require('firebase-admin'),
      Sequelize  = require('sequelize');

const api        = require('./routes/api');

//---------------------
// ⚙️ Configuration ⚙️
//---------------------

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

//----------------
// 🌐 HTML API 🌐
//----------------

// expose public files
app.use(express.static('dist'));

// enable body parser
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next()
});

app.use('/api', api);

// home route
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

// listen on port
let listener = server.listen(process.env.PORT, () => {
  console.log('listening on port ' + listener.address().port);
})