function getListingInformation(listing) {
  let details = document.querySelector(".container");
  db.collection("listings").doc(listing).get().then(docListing => {
    var bookName = docListing.data().bookId;
    var date = docListing.data().date.toDate().toLocaleString();
    var description = docListing.data().description;
    var price = docListing.data().price;
    var userId = docListing.data().userId;
    var image = docListing.data().image;
    var edition = docListing.data().edition;
    var author = docListing.data().author;

      db.collection("users").doc(userId).get().then(docUser => {
        var email = docUser.data().email;
        var name = docUser.data().name;
        localStorage.setItem("userId", userId);
        document.querySelector(".product-description").innerHTML = "<span>Textbook</span><h1>" + bookName + "</h1>";
        document.getElementById("image").src = image;
        document.getElementById("author").innerHTML = "<span>Author: </span>" + author;
        document.getElementById("edition").innerHTML = "<span>Edition: </span>" + edition;
        document.getElementById("description").innerHTML = "<p> </p>" + description;
        document.getElementById("date").innerHTML = "<p>Posted on:</p>" + date;
        document.getElementById("price").innerHTML = "<span>Price: $</span>" + price;
        document.getElementById("name").innerHTML = "<p>Name:</p>" + name;
        document.getElementById("email").innerHTML = "<p>Email:</p>" + email;
      })
  })
}
getListingInformation(localStorage.getItem("listingDocID"));

function showUserAccount() {
  let currentUser =  localStorage.getItem("currUserid");
  let targetUser = localStorage.getItem("userId");
  if(currentUser == targetUser){
    window.location.href = 'edit-account.html';
  } else{
    window.location.href = 'accounts.html';
  }
}