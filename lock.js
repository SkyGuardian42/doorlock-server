//---------------------
// 📡 Websocket API 📡
//---------------------

let sio;

let door = {
  id: '',
  apiKey: process.env.DOOR_SECRET
}

module.exports.listen = io => {
  sio = io
  io.on('connection', socket => {

    // registers the doorlock
    socket.on('register-lock', data => {
      // check for valid api key
      if (data.apiKey !== door.apiKey) 
        return;

      door.id = socket.id;

      console.log('registered lock: ' + door.id);
      socket.emit('registered');
    })
    
    socket.on('disconnect', socket => {
      door.id = ''
    })
    
  })
  
}

module.exports.open =  {
  open() { return new Promise((resolve, reject) => {
    console.log(door.id)
    if(door.id !== ''){
     sio.to(door.id).emit('open')
     resolve('ok')
    } else {
     reject('Keine Tür registriert')  
    }
  })}
}