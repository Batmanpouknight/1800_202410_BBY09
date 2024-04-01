function getName() {
    let userId = localStorage.getItem("currUserid");
    db.collection("users").doc(userId).get()
          .then(doc => {
            let userName = doc.data().name;
            document.getElementById("name-goes-here").innerHTML = "Welcome to Textbook Hero " +  userName + "!"; 
          })
}
getName();