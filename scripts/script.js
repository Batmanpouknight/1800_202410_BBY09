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
displayProducts("listings");