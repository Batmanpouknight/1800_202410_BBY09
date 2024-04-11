//gets and displays current users name
function getName() {
  //gets user id from local storage
  let userId = localStorage.getItem("currUserid");
  //returns and keeps deafalut message 
  if (userId == null) {
    return;
  }
  //gets user document
  db.collection("users").doc(userId).get()
    .then(doc => {
      //stores name in a variable
      let userName = doc.data().name;
      //shows name with a message
      document.getElementById("name-goes-here").innerHTML = "Welcome to Textbook Hero " + userName + "!";
    })
}

//calls fuction
getName();