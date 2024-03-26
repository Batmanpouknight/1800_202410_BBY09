function logout() {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    console.log("logging out user");
    localStorage.removeItem("currUserid");
  }).catch((error) => {
    // An error happened.
  });
}

function displayProducts(collection) {
  db.collection(collection).get()
    .then(allPListings => {
      var i = 1;
      allPListings.forEach(doc => {
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
                var image = doc.data().image;
                var docId = doc.id;

                let item = document.getElementById('item' + i);
                item.querySelector('.number').innerHTML = i;
                item.querySelector('.product').innerHTML = bookName + "<br>" + "Posted by: " + user;
                item.querySelector('.date').innerHTML = "Date posted:" + date;
                item.querySelector('.price').innerHTML = "$" + price;
                item.querySelector('.image').src = "./images/" + image;
                localStorage.setItem('listingDocID' + i, docId);

                i++;
              }).catch(error => {
                console.error("Error getting book document: ", error);
              })
          }).catch(error => {
            console.error("Error getting users document: ", error);
          })

      })
    })
}

function redirect(row) {
  var listingId = localStorage.getItem("listingDocID" + row);
  localStorage.setItem('listingDocID', listingId);
  window.location.href = 'details.html';
  console.log(listingId);
 
}

function getListingInformation(listing) {
  let details = document.querySelector(".container");
  db.collection("listings").doc(listing).get().then(docListing => {
    var bookId = docListing.data().bookId;
    var date = docListing.data().date.toDate().toLocaleString();
    var description = docListing.data().description;
    var price = docListing.data().price;
    var userId = docListing.data().userId;
    var image = docListing.data().image;
    db.collection("books").doc(bookId).get().then(docBook => {
      var bookName = docBook.data().name;
      var author = docBook.data().author;
      var course = docBook.data().course;
      var edition = docBook.data().edition;
      var publisher = docBook.data().publisher;
      var yearPrinted = docBook.data().yearPrinted;
      db.collection("users").doc(userId).get().then(docUser => {
        var email = docUser.data().email;
        var name = docUser.data().name;
        localStorage.setItem("userId", userId);
        document.querySelector(".product-description").innerHTML = "<span>Textbook</span><h1>" + bookName + "</h1>";
        document.getElementById("image").src = "./images/" + image;
        document.getElementById("author").innerHTML = "<span>Author: </span>" + author;
        document.getElementById("edition").innerHTML = "<span>Edition: </span>" + edition;
        document.getElementById("publisher").innerHTML = "<span>Publisher: </span>" + publisher;
        document.getElementById("yearPrinted").innerHTML = "<span>Year of Publication: </span>" + yearPrinted;
        document.getElementById("description").innerHTML = "<p> </p>" + description;
        document.getElementById("date").innerHTML = "<p>Posted on:</p>" + date;
        document.getElementById("price").innerHTML = "<span>Price: $</span>" + price;
        document.getElementById("name").innerHTML = "<p>Name:</p>" + name;
        document.getElementById("email").innerHTML = "<p>Email:</p>" + email;
        document.getElementById("buttonContainer").innerHTML = "<a href='accounts.html'><button class='btn btn-primary'>About</button></a>";

      })
    })
  })
}
