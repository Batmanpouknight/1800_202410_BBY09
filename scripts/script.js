function logout() {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    console.log("logging out user");
    db.collection("users").doc(localStorage.getItem("currUserid")).update({
      lastSeen: firebase.firestore.FieldValue.serverTimestamp()
    });
    setTimeout(function() {
      window.location.href = 'main.html';
  }, 500);
    localStorage.removeItem("currUserid");
  }).catch((error) => {
    // An error happened.
  });
}


