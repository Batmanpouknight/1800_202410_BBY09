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


function deleteUserListings(userId){
  db.collection('users').doc(userId).get().then(doc => {
    let userLisings = doc.data().listings;
    userLisings.forEach(element => {
      db.collection("listings").doc(element).delete();
    });
  })
}

function autoListing(){
  document.getElementById("name").value = "Writing in Technical Fields";
  document.getElementById("price").value = 17;
  document.getElementById("description").value = "Good condition Great book";
  document.getElementById("author").value = "Thorsten Ewald";
  document.getElementById("edition").value = 3;
  document.getElementById("course").value = "COMM 1116";
  document.getElementById("categories").value = "Computing & Information Technology";
    
}