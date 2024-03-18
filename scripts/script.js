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
      //var i = 1;  //Optional: if you want to have a unique ID for each hike
      allProducts.forEach(doc => {
        var bookId = doc.data().bookId;
        db.collection("books").doc(bookId).get()
          .then(bookDoc => {
            var bookName = bookDoc.data().name;
            var date = doc.data().date;
            var price = doc.data().price;
            var user = doc.data().userId;
            let newProduct = productTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

            //update title and text and image
            newProduct.querySelector('.product').innerHTML = bookName + "<br>" + user;
            newProduct.querySelector('.date').innerHTML = date;
            newProduct.querySelector('.price').innerHTML = "$" + price;
            // newProduct.querySelector('.card-text').innerHTML = user;


            // newcard.querySelector('.card-image').src = `./images/${hikeCode}.jpg`; //Example: NV01.jpg

            //Optional: give unique ids to all elements for future use
            // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
            // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
            // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

            //attach to gallery, Example: "hikes-go-here"
            document.getElementById(collection + "-go-here").appendChild(newProduct);

            //i++;   //Optional: iterate variable to serve as unique ID
          })
      })
    })
}
displayProducts("listings");