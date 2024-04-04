function displayProducts(collection) {
    db.collection(collection).limit(10).get()
      .then(allPListings => {
        var i = 1;
        allPListings.forEach(doc => {
          var userId = doc.data().userId;
          db.collection("users").doc(userId).get()
            .then(userDoc => {
                  var bookName = doc.data().bookId;
                  var date = doc.data().date;
                  var price = doc.data().price;
                  var user = userDoc.data().name;
                  var image = doc.data().image;
                  var docId = doc.id;
                  let item = document.getElementById('listings-go-here');
                  item.innerHTML += "<tr id='item"+ i + "' onclick='redirect("+ i +");'>" + 
                  "<td class='number text-center'>" + i + "</td>" +
                  "<td class='image-contain'><img class='image' src='' " +
                      "alt='picture of listing'></td>" + 
                  "<td class='product'><strong>Product 1</strong><br>This is the product description.</td>" +
                  "<td class='date text-right'>Date Posted: </td>" + 
                  "<td class='price text-right'>$350</td>" +
                "</tr>"
                  item.querySelector('.product').innerHTML = bookName + "<br>" + "Posted by: " + user;
                  item.querySelector('.date').innerHTML = "Date posted:" + date.toDate().toLocaleString();
                  item.querySelector('.price').innerHTML = "$" + price;
                  item.querySelector('.image').src =  image;
                  localStorage.setItem('listingDocID' + i, docId);
  
                  i++;
            })
  
        })
      })
  }
  displayProducts("listings");
  //coolest code ever