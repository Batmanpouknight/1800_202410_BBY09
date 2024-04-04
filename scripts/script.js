function logout() {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    console.log("logging out user");
    db.collection("users").doc(localStorage.getItem("currUserid")).update({
      lastSeen: firebase.firestore.FieldValue.serverTimestamp()
    });
    localStorage.removeItem("currUserid");
    // alert("Logging out");
  }).catch((error) => {
    // An error happened.
  });
}


