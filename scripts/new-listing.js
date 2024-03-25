function createNewListing(){
    var listingRef = db.collection("listings");
    let bookName = document.getElementById("name").value;
    let price = document.getElementById("price").value;
    let description = document.getElementById("description").value;
    let image = document.getElementById("picture").value;
    listingRef.add({
        bookId: bookName,
        date: firebase.firestore.FieldValue.serverTimestamp(),
        description: description,
        image: null,
        price: price,
        userId: null
    });
}