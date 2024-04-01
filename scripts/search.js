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
  displayProducts("listings");