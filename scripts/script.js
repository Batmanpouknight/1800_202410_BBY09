function logout() {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    console.log("logging out user");
    db.collection("users").doc(user.uid).update({
      lastSeen: firebase.firestore.FieldValue.serverTimestamp()
    });
    localStorage.removeItem("currUserid");
  }).catch((error) => {
    // An error happened.
  });
}



function redirect(row) {
  var listingId = localStorage.getItem("listingDocID" + row);
  localStorage.setItem('listingDocID', listingId);
  window.location.href = 'details.html';
}

