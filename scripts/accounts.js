function getContactInformation(user) {
    let accounts = document.getElementById("about");
    db.collection("users").doc(user).get().then(docUser => {
        var email = docUser.data().email;
        var name = docUser.data().name;
        var school = docUser.data().school;
        var country = docUser.data().country;
        var listings = docUser.data().listings;
        var rating = docUser.data().ratings;
        document.getElementById("name").innerHTML = "<label>Name</label><p>" + name + "</p>";
        document.getElementById("email").innerHTML = "<label>Email</label><p>" + email + "</p>";
        document.getElementById("school").innerHTML = "<label>School</label><p>" + school + "</p>";
        document.getElementById("country").innerHTML = "<label>Country</label><p>" + country + "</p>";
        if(listings != null){
            displayListings(localStorage.getItem("userId"));
        }
        if (rating != null) {
            getAverageScore(rating);
        }
    })
}
getContactInformation(localStorage.getItem("userId"));

function getAverageScore(rating){
    let total = 0;
    let index = 0;
    let average;
    rating.forEach(function(num){
        total += num;
        index++;
    });
    average = total/index;
    document.getElementById("average-goes-here").innerHTML = "Hero Rating: " + average;
}

function displayListings(user){
    db.collection("users").doc(user).get().then(docUser => {
        var listings = docUser.data().listings;
        var count = 0;
        listings.forEach(thisListingId => {
            db.collection("listings").doc(thisListingId).get().then(listingDoc => {
                if (count >= 2) {
                    return;
                }
                var bookId = listingDoc.data().bookId;
                var time = listingDoc.data().date.toDate().toLocaleString();
                var image = listingDoc.data().image;
                db.collection("books").doc(bookId).get().then(bookDoc => {
                    let bookName = bookDoc.data().name;
                    document.getElementById("listings").innerHTML += "<div class='item'><img src=" + './images/' + image + "><h4>" + bookName + "</h4><div>posted on:" + time + "</div></div>";
                    count++;
                })
            })
        });
    })
}