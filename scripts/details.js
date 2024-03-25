function getContactInformation(user) {
    // fetch the user info from the data base and store into fields
    db.collection("users").doc(user).get().then(docUser => {

        // for the button
        var redirectButton = document.createElement("button");
        redirectButton.innerHTML = "View Account"; // Set the button text
        //to add style to it
        redirectButton.classList.add("btn", "btn-primary");

        // Attach an event listener to the button
        redirectButton.onclick = function() {
            // Construct the URL for the user-specific page
            var userAccountUrl = "http://127.0.0.1:5501/accounts/" + user + ".html";
            // Redirect to the user-specific page
            window.location.href = userAccountUrl;
        };

        // Append the button to the DOM 
        var buttonContainer = document.getElementById("buttonContainer");
        buttonContainer.appendChild(redirectButton);
    });
}

// Call the function with the user ID
getContactInformation("UmYiMWubRmQ0kCt4aEbiMuknsm12");
