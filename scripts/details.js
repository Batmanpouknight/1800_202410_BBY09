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
  getListingInformation(localStorage.getItem("listingDocID"));