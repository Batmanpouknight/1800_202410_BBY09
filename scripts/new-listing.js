var ImageFile;

//makes sure user is logged in if not they get kicked to login page
function checkLogIn() {
    let userId = localStorage.getItem("currUserid");
    if (userId == null) {
        alert("You are not logged in");
        window.location.href = 'login.html';
    }
}
//calls function
checkLogIn();

//function that gets called when the submit button is clicked
//it gets all the values form the form and puts it into our firebase
function createNewListing() {
    //gets the values from our form
    //the values for our form are stored as string si they have to be parsed
    let bookName = document.getElementById("name").value;
    let priceAsString = document.getElementById("price").value;
    let price = parseInt(priceAsString);
    let description = document.getElementById("description").value;
    let author = document.getElementById("author").value;
    let editionAsString = document.getElementById("edition").value;
    let edition = parseInt(editionAsString);
    let course = document.getElementById("course").value;
    let categories = document.getElementById("categories").value;
    //the submit button
    let subBut = document.getElementById('submit-button');
    //disabled when user clicks it once so multiple listings can't get posted
    subBut.disabled = true;
    //if a field id empty throws a warning
    if (bookName == "" || price == "" || description == "" || course == "" || author == "" || edition == "" || ImageFile == undefined) {
        alert("fill every field");
        subBut.disabled = false;
        return;
    }
    //checks if the fields with number have something else in them
    if (isNaN(price) || isNaN(edition)) {
        alert("please enter only numbers in price and edition fields");
        subBut.disabled = false;
        return;
    }
    //checks that the price is in range
    if (price > 1000 || price < 0) {
        alert("books can not be that price");
        subBut.disabled = false;
        return;
    }

    //adds a new listing document with those values
    db.collection("listings").add({
        author: author,
        bookId: bookName,
        category: categories,
        course: course,
        date: firebase.firestore.FieldValue.serverTimestamp(),
        description: description,
        edition: edition,
        image: null,
        price: price,
        userId: localStorage.getItem("currUserid")
    }).then(doc => {
        db.collection("users").doc(localStorage.getItem("currUserid")).update({
            //updates the listings array in currebt users firestore
            listings: firebase.firestore.FieldValue.arrayUnion(doc.id)
        })
        //uploads the picture
        uploadPic(doc.id);

        //after a few seconds moves to thanks page
        setTimeout(function () {
            window.location.href = 'thanks.html';
        }, 3000);
    });

}
function listenFileSelect() {
    // listen for file selection
    var fileInput = document.getElementById("picture"); // pointer #1
    const image = document.getElementById("mypic-goes-here"); // pointer #2

    // When a change happens to the File Chooser Input
    fileInput.addEventListener('change', function (e) {
        ImageFile = e.target.files[0];   //Global variable
        var blob = URL.createObjectURL(ImageFile);
        image.src = blob; // Display this image
        console.log(ImageFile);
    })

}
listenFileSelect();

//------------------------------------------------
// So, a new post document has just been added
// and it contains a bunch of fields.
// We want to store the image associated with this post,
// such that the image name is the postid (guaranteed unique).
// 
// This function is called AFTER the post has been created, 
// and we know the post's document id.
//------------------------------------------------
function uploadPic(postDocID) {
    console.log("inside uploadPic " + postDocID);
    var storageRef = storage.ref("images/" + postDocID + ".jpg");

    storageRef.put(ImageFile)   //global variable ImageFile

        // AFTER .put() is done
        .then(function () {
            console.log('2. Uploaded to Cloud Storage.');
            storageRef.getDownloadURL()

                // AFTER .getDownloadURL is done
                .then(function (url) { // Get URL of the uploaded file
                    console.log("3. Got the download URL.");

                    // Now that the image is on Storage, we can go back to the
                    // post document, and update it with an "image" field
                    // that contains the url of where the picture is stored.
                    db.collection("listings").doc(postDocID).update({
                        "image": url // Save the URL into users collection
                    })

                })
        })
        .catch((error) => {
            console.log("error uploading to cloud storage");
        })
}

