//this fuction gets the listings information from firebase with listing id as parameter
//is a bit long but having it all in one function makes it more readable imho
function getListingInformation(listing) {
  //gets the listing document from firebase
  db.collection("listings").doc(listing).get().then(docListing => {
    //stores all the information in variables
    let bookName = docListing.data().bookId;
    let date = docListing.data().date.toDate().toLocaleString();
    let description = docListing.data().description;
    let price = docListing.data().price;
    let userId = docListing.data().userId;
    let image = docListing.data().image;
    let edition = docListing.data().edition;
    let author = docListing.data().author;
    let course = docListing.data().course;
    //if the user who posted is the same as our current user we will give them the option to delete their listing
    if (userId == localStorage.getItem('currUserid')) {
      document.getElementById('buttonContainer').innerHTML += "<button class='btn btn-danger' onclick='deleteListing();'>Delete Listing</button>";
    }
    //gets the user email and name to display
    db.collection("users").doc(userId).get().then(docUser => {
      //stores user information
      let email = docUser.data().email;
      let name = docUser.data().name;
      //stores the user if so when user moves to accounts page to get more information we display the correct info
      localStorage.setItem("userId", userId);
      //shows our information in html
      document.querySelector(".product-description").innerHTML = "<span>Textbook</span><h1>" + bookName + "</h1>";
      document.getElementById("image").src = image;
      document.getElementById("author").innerHTML = "<span>Author: </span>" + author;
      document.getElementById("edition").innerHTML = "<span>Edition: </span>" + edition;
      document.getElementById("course").innerHTML = "<span>Course: </span>" + course;
      document.getElementById("description").innerHTML = "<p> </p>" + description;
      document.getElementById("date").innerHTML = "<p>Posted on:</p>" + date;
      document.getElementById("price").innerHTML = "<span>Price: $" + price + "</span>";
      document.getElementById("name").innerHTML = "<p>Name:</p>" + name;
      document.getElementById("email").innerHTML = "<p>Email:</p>" + email;
    })
  })
}
//calls fuction
getListingInformation(localStorage.getItem("listingDocID"));

//called when about button is clicked and moves user to either their own profile or another users information
function showUserAccount() {
  //stores user ids in variables
  let currentUser = localStorage.getItem("currUserid");
  let targetUser = localStorage.getItem("userId");
  //checks if the user is clicking on their own listing
  if (currentUser == targetUser) {
    window.location.href = 'edit-account.html';
  } else {
    window.location.href = 'accounts.html';
  }
}
//fucntion for users to delete their own listing if someone buys it
function deleteListing() {
  //stores user id and listing id in a variable
  let listing = localStorage.getItem('listingDocID');
  let user = localStorage.getItem('currUserid');
  //asks users for conformation
  if (confirm("Are you sure you want to delete this listing? you cannot reverse your choice")) {
    //deletes document from listings collection
    db.collection('listings').doc(listing).delete();
    //gets the users document
    db.collection('users').doc(user).get().then(doc => {
      //stores the listings in an array
      let listings = doc.data().listings;
      //finds index where the listing id exists
      let indexofListing = listings.indexOf(listing);
      //deletes the deleted id from array
      listings.splice(indexofListing, 1);
      //updates the listing array with the new one that does not have the deleted listing id
      db.collection('users').doc(user).update({
        listings: listings
      });
    });
    //delays for one second then redirects to our browse page
    setTimeout(function () {
      window.location.href = 'search.html';
    }, 1000);
  }
}