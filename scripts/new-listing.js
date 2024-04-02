var ImageFile;
function checkLogIn(){
    let userId = localStorage.getItem("currUserid");
    if(userId == null){
        alert("You are not logged in");
        window.location.href = 'login.html';
    }
}
checkLogIn();

function createNewListing(){
    var listingRef = db.collection("listings");
    let bookName = document.getElementById("name").value;
    let priceAsString = document.getElementById("price").value;
    let price = parseInt(priceAsString);
    let description = document.getElementById("description").value;
    let image = document.getElementById("picture").value;
    if (bookName == "" || price == "" || description == "") {
        alert("fill every field");
        return;
    }
    console.log(price);
    if(isNaN(price)){
        alert("please enter only numbers in price field");
        return;
    }
    listingRef.add({
        bookId: bookName,
        date: firebase.firestore.FieldValue.serverTimestamp(),
        description: description,
        image: null,
        price: price,
        userId: localStorage.getItem("currUserid")
    }).then(doc => {
        // uploadPic(doc.id);
        // window.location.href = 'main.html';
        db.collection("users").doc(localStorage.getItem("currUserid")).update({
            listings: firebase.firestore.FieldValue.arrayUnion(doc.id)
        });
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
                    db.collection("posts").doc(postDocID).update({
                            "image": url // Save the URL into users collection
                        })
                         // AFTER .update is done
                        // .then(function () {
                        //     console.log('4. Added pic URL to Firestore.');
                        //     // One last thing to do:
                        //     // save this postID into an array for the OWNER
                        //     // so we can show "my posts" in the future
                        //     savePostIDforUser(postDocID);
                        // })
                })
        })
        .catch((error) => {
             console.log("error uploading to cloud storage");
        })
}

