// SERVER PROTOTYPE
const express    = require('express'),
      bodyParser = require('body-parser'),
      app        = express(),
      server     = require('http').Server(app),
      io         = require('socket.io')(server),
      admin      = require('firebase-admin'),
      Sequelize  = require('sequelize');

const api        = require('./routes/api');

//----------------
// 🗄️ Database 🗄️
//----------------

// initiate connection
const sequelize = new Sequelize('database', process.env.DB_USER, process.env.DB_PASS, {
  host: '0.0.0.0',
  dialect: 'sqlite',
  operatorsAliases: false,
  storage: '.data/database.sqlite',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// create tables
let Log;
let User;
 
// create Log database
sequelize.authenticate()
  .then(() => {
    Log = sequelize.define('entry', {
      user:   {type: Sequelize.STRING},
      action: {type: Sequelize.STRING}
    });
  })

// create Users database
sequelize.authenticate()
  .then(() => {
    User = sequelize.define('entry', {
      uid:   {type: Sequelize.STRING},
      name:  {type: Sequelize.STRING},
      admin: {type: Sequelize.BOOLEAN}
    })
  })

//---------------------
// ⚙️ Configuration ⚙️
//---------------------

// in-memory database
let doorStatus = {
  id: '',
  apiKey: process.env.DOOR_SECRET,
}

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

app.use('/api', api);

// home route
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

// opens door
// token - firebase token
app.post("/open", (req, res) => {
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

//-------------------
// 🗄️ Database API 🗄️
//-------------------

// shows logs
// token - firebase token
// offset  - 10 log entries, starting from last position
app.post("/logs", (req, res) => {
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

// adds a user
// token - firebase token
// name  - name of the user
// email - email of the user
// admin - boolean if admin or not
app.put("/add", (req, res) => {
})

// lists users
// token - firebase token
app.post("/users", (req, res) => {
})

// deletes a user
// token - firebase token
// uid - uid of user to delete
app.delete('/delete', (req, res) => {
})

// changes a users role
// token - firebase token
// uid   - target user uid
// role  - admin or not 
app.patch('/user', (req, res) => {
})


// listen on port
let listener = server.listen(process.env.PORT, () => {
  console.log('listening on port ' + listener.address().port);
})

//---------------------
// 📡 Websocket API 📡
//---------------------

io.on('connection', socket => {
  
  // registers the doorlock
  socket.on('register-lock', data => {
    // check for valid api key
    if (data.apiKey !== doorStatus.apiKey) 
      return;

    doorStatus.id = socket.id;
    
    console.log('registered lock: ' + doorStatus.id);
    socket.emit('registered');
  })
})