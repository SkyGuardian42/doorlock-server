// SERVER PROTOTYPE
const express    = require('express'),
      bodyParser = require('body-parser'),
      app        = express(),
      server     = require('http').Server(app),
      io         = require('socket.io')(server),
      door       = require('./lock').listen(io),
      Sequelize  = require('sequelize'),
      api        = require('./routes/api');

//---------------------
// ⚙️ Configuration ⚙️
//---------------------

// expose public files
app.use(express.static('dist'));

// enable body parser
app.use(bodyParser.json());

//----------------
// 🌐 HTML API 🌐
//----------------
app.use('/api', api);

// home route
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

// listen on port
let listener = server.listen(process.env.PORT, () => {
  console.log('listening on port ' + listener.address().port);
})