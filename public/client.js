//-------------------------------------
// 🚪🔒 DOORLOCK CLIENT PROTOTYPE 🚪🔒
//-------------------------------------

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAuhn5rTvl91iGOugkxfdG_HvHWDiAwlUs",
  authDomain: "hgo-doorlock.firebaseapp.com",
  databaseURL: "https://hgo-doorlock.firebaseio.com",
  projectId: "hgo-doorlock",
  storageBucket: "hgo-doorlock.appspot.com",
  messagingSenderId: "308945458314"
});

// Get Button elements
let openBtn   = document.querySelector('.open'),
    logoutBtn = document.querySelector('.logout'),
    loginBtn  = document.querySelector('.login');

//-----------------
// 🔓 Open Door 🔓
//-----------------

openBtn.addEventListener('click', event => {
  firebase.auth().currentUser.getIdToken(true).then( token => {
    
    fetch('/open', {
      method: "POST",
      body: JSON.stringify({token: token}),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "omit"
    })
    .then(res => res.json())
    .then(json => console.log(json))

  }).catch(function(error) {
    alert(error)
  });
})

//--------------------
// 🔒 Login System 🔒
//--------------------

// ❌ Firebase logout
logoutBtn.addEventListener('click', event => {
  firebase.auth().signOut().catch(error => {
    alert(error.message);
  });
})

// ✔️ Firebase login
document.querySelector('.loginForm').addEventListener('submit', event => {
  event.preventDefault();
  
  firebase.auth().signInWithEmailAndPassword(event.target[0].value, event.target[1].value)
    .catch(function(error) {
      alert(error.message);
  });
});

// 🔐 Check for current authentication status
firebase.auth().onAuthStateChanged(user => {
  // user is signed in
  if (user) {
    // show controls and hide login screen
    document.querySelector('.loggedOut').setAttribute('hidden', '');
    document.querySelector('.loggedIn').removeAttribute('hidden');
    
  // user is signed out  
  } else {
    // show login page and hide controls
    document.querySelector('.loggedOut').removeAttribute('hidden');
    document.querySelector('.loggedIn').setAttribute('hidden', '');
  }
});

//-----------------------------
// 📱 Better 100VH on mobile 📱
//-----------------------------

function calcVH () {
	var vH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	document.querySelector('body').setAttribute("style", "height:" + vH + "px;");
}
window.onload = calcVH();
window.addEventListener('onorientationchange', calcVH, true);
window.addEventListener('resize', calcVH, true);

//------------------------------------
// 🔧 Service worker registration 🔧
//------------------------------------

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('service-worker.js');
// }