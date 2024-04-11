var currentUser;   
var listings;
//gets the users info and places it the form
function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    let userName = userDoc.data().name;
                    let userSchool = userDoc.data().school;
                    let userCity = userDoc.data().city;
                    let userNumber = userDoc.data().number;

                    //if the data fields are not empty, then write them in to the form.
                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }
                    if (userSchool != null) {
                        document.getElementById("schoolInput").value = userSchool;
                    }
                    if (userCity != null) {
                        document.getElementById("cityInput").value = userCity;
                    }
                    if (userNumber != null) {
                        document.getElementById("numberInput").value = userNumber;
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

//call the function to run it 
populateUserInfo();

//enables the form to edit information
function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
}

//Updated database with new info
function saveUserInfo() {
    //a) get user entered values
    userName = document.getElementById('nameInput').value;       //get the value of the field with id="nameInput"
    userSchool = document.getElementById('schoolInput').value;     //get the value of the field with id="schoolInput"
    userCity = document.getElementById('cityInput').value;       //get the value of the field with id="cityInput"
    userNumber = document.getElementById('numberInput').value; 
    //b) update user's document in Firestore
    currentUser.update({
        name: userName,
        school: userSchool,
        city: userCity,
        number: userNumber
    })
        .then(() => {
            console.log("Document successfully updated!");
        })
    //c) disable edit 
    document.getElementById('personalInfoFields').disabled = true;
}

//shows all the users listings
function displayListings(user) {
    listings = [];
    //gets the users document
    db.collection("users").doc(user).get().then(docUser => {
        listings = docUser.data().listings;
        //goes through every listing and displays
        for (let index = 0; index < listings.length; index++) {
            //gets that listings doc
            db.collection("listings").doc(listings[index]).get().then(listingDoc => {
                //stores info in variables
                let bookName = listingDoc.data().bookId;
                let time = listingDoc.data().date.toDate().toLocaleString();
                let image = listingDoc.data().image;
                //puts info in our html
                document.getElementById("listings").innerHTML += "<div class='item'><img src=" + image + "><h4>" + bookName 
                + "</h4><div>posted on:" + time + "</div><button type='button' onclick='redirect(" + index + ");'>see details</button></div>";
            });
        }
    });
}

//calls the function
displayListings(localStorage.getItem('currUserid'));

//redirects to listind detail
function redirect(num) {
    let listingId = listings[num];
    localStorage.setItem('listingDocID', listingId);
    window.location.href = 'details.html';
  }