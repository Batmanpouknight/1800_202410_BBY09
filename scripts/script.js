function logout() {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    console.log("logging out user");
    db.collection("users").doc(localStorage.getItem("currUserid")).update({
      lastSeen: firebase.firestore.FieldValue.serverTimestamp()
    });
    localStorage.removeItem("currUserid");
    alert("Logging out");
  }).catch((error) => {
    // An error happened.
  });
}

function redirect(row) {
  var listingId = localStorage.getItem("listingDocID" + row);
  localStorage.setItem('listingDocID', listingId);
  window.location.href = 'details.html';
}

