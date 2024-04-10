function getContactInformation(user) {
    let accounts = document.getElementById("about");
    db.collection("users").doc(user).get().then(docUser => {
        var email = docUser.data().email;
        var name = docUser.data().name;
        var school = docUser.data().school;
        var country = docUser.data().country;
        var listings = docUser.data().listings;
        var totalRating = docUser.data().ratingsTotal;
        var reviews = docUser.data().reviews;
        var lastSeen = docUser.data().lastSeen.toDate().toLocaleString();
        document.getElementById("name").innerHTML = "<label>Name</label><p>" + name + "</p>";
        document.getElementById("email").innerHTML = "<label>Email</label><p>" + email + "</p>";
        document.getElementById("school").innerHTML = "<label>School</label><p>" + school + "</p>";
        document.getElementById("country").innerHTML = "<label>Country</label><p>" + country + "</p>";
        document.getElementById("last-seen").innerHTML = "<label>Last Seen</label><p>" + lastSeen + "</p>";
        if (listings != null) {
            displayListings(localStorage.getItem("userId"));
        }
        let average = totalRating / reviews.length;
        document.getElementById("average-goes-here").innerHTML = "Hero Rating: " + average.toFixed(1) + "/5 (" + reviews.length + ")";
    })
}
getContactInformation(localStorage.getItem("userId"));


function displayListings(user) {
    db.collection("users").doc(user).get().then(docUser => {
        var listings = docUser.data().listings;
        var count = 0;
        listings.forEach(thisListingId => {
            db.collection("listings").doc(thisListingId).get().then(listingDoc => {
                if (count >= 2) {
                    return;
                }
                var bookName = listingDoc.data().bookId;
                var time = listingDoc.data().date.toDate().toLocaleString();
                var image = listingDoc.data().image;
                document.getElementById("listings").innerHTML += "<div class='item'><img src=" + image + "><h4>" + bookName + "</h4><div>posted on:" + time + "</div></div>";
                count++;
            })
        });
    })
}