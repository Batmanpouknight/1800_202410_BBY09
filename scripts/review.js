var revieweeID;
var reviewerID;
var rating = 0;
function setUp() {
    revieweeID = localStorage.getItem('userId');
    reviewerID = localStorage.getItem('currUserid');
    if (reviewerID == null) {
        alert("You are not logged in!");
        window.location.href = 'login.html';
    }
    db.collection("users").doc(reviewerID).get().then(docThisUser => {
        let reviewedUsers = docThisUser.data().usersReviewed;
        if (reviewedUsers != undefined) {
            reviewedUsers.forEach(function (userId) {
                if (userId == revieweeID) {
                    alert("you have already reviewed this user");
                    window.location.href = "main.html";
                }
            })
        }
    });
    //shows reviewee name
    db.collection("users").doc(revieweeID).get().then(docUser => {
        let revieweeName = docUser.data().name;
        document.getElementById("reviewee-goes-here").innerHTML = "Write a review for " + revieweeName;
    });
    //show rating user has entered in number
    document.getElementById("rating-goes-here").innerHTML = "Rating: " + rating;
    //adds stars
    for (let index = 1; index <= 5; index++) {
        document.getElementById("stars-go-here").innerHTML += "<span class='material-symbols-outlined' id=star" + index + " onclick='changeRating(" + index + ")'>star</span>";
    }
}
setUp();

function changeRating(num) {
    //reset the stars FILL 0
    document.querySelectorAll(".material-symbols-outlined").forEach(function (element) {
        element.style.fontVariationSettings = "'FILL' 0,'wght' 700,'GRAD' 0,'opsz' 48";
    });
    //change rating
    rating = num; 1
    //show rating again
    document.getElementById("rating-goes-here").innerHTML = "Rating: " + rating;
    //make the stars full
    for (let index = 1; index <= num; index++) {
        document.getElementById("star" + index).style.fontVariationSettings = "'FILL' 1,'wght' 700,'GRAD' 0,'opsz' 48";
    }
}

function submitReview() {
    let desc = document.getElementById("description").value;
    if (rating == 0 || desc == null) {
        alert("fill every field");
        return;
    }
    db.collection("reviews").add({
        description: desc,
        rating: rating,
        revieweeID: revieweeID,
        reviewerID: reviewerID,
        date: firebase.firestore.FieldValue.serverTimestamp()
    }).then(function (docRef) {
        db.collection("users").doc(revieweeID).get().then(revieweeDoc => {
            let ratingTotal = revieweeDoc.data().ratingsTotal;
            ratingTotal += rating;
            console.log(ratingTotal);

            db.collection("users").doc(revieweeID).update({
                reviews: firebase.firestore.FieldValue.arrayUnion(docRef.id),
                ratingsTotal: ratingTotal
            });
            db.collection("users").doc(reviewerID).update({
                usersReviewed: firebase.firestore.FieldValue.arrayUnion(revieweeID)
            });
        });
    });
}