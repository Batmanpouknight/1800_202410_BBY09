function logout() {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    console.log("logging out user");
  }).catch((error) => {
    // An error happened.
  });
}

function displayProducts(collection) {
  let productTemplate = document.getElementById("productTemplate");
  db.collection(collection).get()
    .then(allProducts => {
      allProducts.forEach(doc => {
        var userId = doc.data().userId;
        db.collection("users").doc(userId).get()
          .then(userDoc => {
            var bookId = doc.data().bookId;
            db.collection("books").doc(bookId).get()
              .then(bookDoc => {
                var bookName = bookDoc.data().name;
                var date = doc.data().date.toDate().toLocaleString();
                var price = doc.data().price;
                var user = userDoc.data().name;
                let newProduct = productTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                //update title and text and image
                newProduct.querySelector('.product').innerHTML = bookName + "<br>" + "Posted by: " + user;
                newProduct.querySelector('.date').innerHTML = "Date posted:" + date;
                newProduct.querySelector('.price').innerHTML = "$" + price;
                // newcard.querySelector('.card-image').src = `./images/${hikeCode}.jpg`; //Example: NV01.jpg

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newProduct);
              }).catch(error => {
                console.error("Error getting book document: ", error);
              })
          }).catch(error => {
            console.error("Error getting users document: ", error);
          })
      })
    })
}
function getListingInformation(listing){
  let details = document.querySelector(".container");
  db.collection("listings").doc(listing).get().then(docListing=>{
      var bookId = docListing.data().bookId;
      var date = docListing.data().date.toDate().toLocaleString();
      var description = docListing.data().description;
      var price = docListing.data().price;
      var userId = docListing.data().userId;
      db.collection("books").doc(bookId).get().then(docBook=>{
        var bookName = docBook.data().name;
        var author = docBook.data().author;
        var course = docBook.data().course;
        var edition = docBook.data().edition;
        var publisher = docBook.data().publisher;
        var yearPrinted = docBook.data().yearPrinted;
        db.collection("users").doc(userId).get().then(docUser=>{
          var email = docUser.data().email;
          var name = docUser.data().name;
          document.querySelector(".product-description").innerHTML = "<span>Textbook</span><h1>" + bookName + "</h1>";
          document.getElementById("author").innerHTML = "<span>Author: </span>" + author;
          document.getElementById("edition").innerHTML = "<span>Edition: </span>" + edition;
          document.getElementById("publisher").innerHTML = "<span>Publisher: </span>" + publisher;
          document.getElementById("yearPrinted").innerHTML = "<span>Year of Publication: </span>" + yearPrinted;
          document.getElementById("description").innerHTML ="<p> </p>" + description;
          document.getElementById("date").innerHTML = "<p>Posted on:</p>" + date;
          document.getElementById("price").innerHTML = "<span>Price: $</span>" + price;
          document.getElementById("name").innerHTML = "<p>Name:</p>" + name;
          document.getElementById("email").innerHTML = "<p>Email:</p>" + email;
          
          
        })
      })
  })
}
getListingInformation("AFH4semSM0RTKw4FdaFu");