//gets the contact users information and displays it in our html the user is taken from our local storage
function getContactInformation(user) {
    //gets our user document based on the param
    db.collection("users").doc(user).get().then(docUser => {
        //Stores all the data in varaibles
        var email = docUser.data().email;
        var name = docUser.data().name;
        var school = docUser.data().school;
        var country = docUser.data().country;
        var listings = docUser.data().listings;
        var totalRating = docUser.data().ratingsTotal;
        var reviews = docUser.data().reviews;
        var lastSeen = docUser.data().lastSeen.toDate().toLocaleString();
        let average = totalRating / reviews.length;
        //places in our html
        document.getElementById("name").innerHTML = "<label>Name</label><p>" + name + "</p>";
        document.getElementById("email").innerHTML = "<label>Email</label><p>" + email + "</p>";
        document.getElementById("school").innerHTML = "<label>School</label><p>" + school + "</p>";
        document.getElementById("country").innerHTML = "<label>Country</label><p>" + country + "</p>";
        document.getElementById("last-seen").innerHTML = "<label>Last Seen</label><p>" + lastSeen + "</p>";
        document.getElementById("average-goes-here").innerHTML = "Hero Rating: " + average.toFixed(1) + "/5 (" + reviews.length + ")";
        //if not null calls displayListings function
        if (listings != null) {
            displayListings(localStorage.getItem("userId"));
        }
    });
}
getContactInformation(localStorage.getItem("userId"));

//shows the users listings with the user we want the listing of as param
function displayListings(user) {
    //gets our user document on firebase
    db.collection("users").doc(user).get().then(docUser => {
        //gets the array of listing ids stored in firebase
        var listings = docUser.data().listings;
        //to check how many listings we have
        var count = 0;
        //for every id in the array 
        listings.forEach(thisListingId => {
            //gets the listing document
            db.collection("listings").doc(thisListingId).get().then(listingDoc => {
                //makes sure we dont have more than 3 listings
                if (count >= 3) {
                    return;
                }
                //stores info in variables
                var bookName = listingDoc.data().bookId;
                var time = listingDoc.data().date.toDate().toLocaleString();
                var image = listingDoc.data().image;
                //displays info in our html
                document.getElementById("listings").innerHTML += "<div class='item'><img src=" + image + "><h4>" + bookName + "</h4><div>posted on:" + time + "</div></div>";
                //increments our count
                count++;
            });
        });
    })
}