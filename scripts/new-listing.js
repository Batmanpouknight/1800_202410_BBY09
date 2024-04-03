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
    let author = document.getElementById("author").value;
    let editionAsString = document.getElementById("edition").value;
    let edition = parseInt(editionAsString);
    let course = document.getElementById("course").value;
    let categories = document.getElementById("categories").value;
    if (bookName == "" || price == "" || description == "" || course == "" || author == "" || edition == "" || ImageFile == undefined) {
        alert("fill every field");
        return;
    }
    if(isNaN(price) || isNaN(edition)){
        alert("please enter only numbers in price and edition fields");
        return;
    }
    listingRef.add({
        author: author,
        bookId: bookName,
        category: categories,
        course: course,
        edition: edition,
        date: firebase.firestore.FieldValue.serverTimestamp(),
        description: description,
        price: price,
        userId: localStorage.getItem("currUserid")
    }).then(doc => {
        uploadPic(doc.id);
        db.collection("users").doc(localStorage.getItem("currUserid")).update({
            listings: firebase.firestore.FieldValue.arrayUnion(doc.id)
        });
    });
    window.location.href = 'thanks.html';
    
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

