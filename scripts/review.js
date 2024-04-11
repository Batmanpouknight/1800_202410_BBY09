var revieweeID;
var reviewerID;
var rating = 0;
//sets up variables and checks that everything is in order
function setUp() {
    //gets user ids from local storage
    revieweeID = localStorage.getItem('userId');
    reviewerID = localStorage.getItem('currUserid');
    //if the user is not logged in kicks them to login page
    if (reviewerID == null) {
        alert("You are not logged in!");
        window.location.href = 'login.html';
    }
    //checks in the users documnet that the reviewee is not part of the reviwedUsers array
    //that stores the users that have been reviewed
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

//changes rating every time a star is clicked
function changeRating(num) {
    //reset the stars FILL 0 because of google icons new way it works
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

//when the user wants to submit their review
function submitReview() {
    let desc = document.getElementById("description").value;
    //disables submit button so multiple reviews cannot be submited
    document.getElementById('submit-button').disabled = true;
    //tells user to fill every field if a field is empty or the rating is zero
    if (rating == 0 || desc == null) {
        alert("fill every field");
        document.getElementById('submit-button').disabled = false;
        return;
    }
    //creates a new review document
    db.collection("reviews").add({
        description: desc,
        rating: rating,
        revieweeID: revieweeID,
        reviewerID: reviewerID,
        date: firebase.firestore.FieldValue.serverTimestamp()
    }).then(function (docRef) {
        //gets reviewees data in order to increment their total rating
        db.collection("users").doc(revieweeID).get().then(revieweeDoc => {
            //stores the current rating total
            let ratingTotal = revieweeDoc.data().ratingsTotal;
            //adds new rating total to it
            ratingTotal += rating;
            //updates rating total and stores the review id in an array
            db.collection("users").doc(revieweeID).update({
                reviews: firebase.firestore.FieldValue.arrayUnion(docRef.id),
                ratingsTotal: ratingTotal
            });
            //updates the reviewers user document to include the reviewees id so that
            //users can't get review bombed by one account
            db.collection("users").doc(reviewerID).update({
                usersReviewed: firebase.firestore.FieldValue.arrayUnion(revieweeID)
            });
            //redirects back to accounts page after 1 second
            setTimeout(function(){
                window.location.href = 'accounts.html';
            }, 1000);
            
        });
    });
    
}