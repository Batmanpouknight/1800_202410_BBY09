function getContactInformation(user) {
    let accounts = document.getElementById("about");
    db.collection("users").doc(user).get().then(docUser => {
        var email = docUser.data().email;
        var name = docUser.data().name;
        var school = docUser.data().school;
        var country = docUser.data().country;
        document.getElementById("name").innerHTML = "<label>Name</label><p>" + name + "</p>";
        document.getElementById("email").innerHTML = "<label>Email</label><p>" + email + "</p>";
        document.getElementById("school").innerHTML = "<label>School</label><p>" + school + "</p>";
        document.getElementById("country").innerHTML = "<label>Country</label><p>" + country + "</p>";
    })
}
getContactInformation(localStorage.getItem("userId"));
