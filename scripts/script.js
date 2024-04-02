function logout() {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    console.log("logging out user");
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

