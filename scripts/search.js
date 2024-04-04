var category;
var maxPrice;
var minPrice;
var everyListingId;
var totalPages;

function loadEveryListing() {
  everyListingId = [];
  totalPages = 1;
  let i = 1;
  db.collection("listings").get()
    .then(allPListings => {
      allPListings.forEach(doc => {
        var price = doc.data().price;
        var docId = doc.id;
        var bookCategory = doc.data().category;
        if ((category == undefined || category == bookCategory) && ((maxPrice == undefined && minPrice == undefined) || (price >= minPrice && price <= maxPrice))) {
          everyListingId.push(docId);
          i++;
        }
        if (i > totalPages * 10) {
          totalPages++;
          document.getElementById("page-number-goes-here").innerHTML += "<button onclick='moveToOtherPage(" + totalPages + ");'>" + totalPages + "</button>";
        }
      });
      showListings(1);
    });
}
loadEveryListing();

function showListings(page) {
  let item = document.getElementById('listings-go-here');
  item.innerHTML = "";
  if (everyListingId.length == 0) {
    item.innerHTML = "<h1>No Results</h1>";
  }
  for (let index = (page - 1) * 10 + 1; index <= page * 10; index++) {
    console.log(index);
    db.collection("listings").doc(everyListingId[index - 1]).get()
      .then(doc => {
        var userId = doc.data().userId;
        db.collection("users").doc(userId).get()
          .then(userDoc => {
            var bookName = doc.data().bookId;
            var date = doc.data().date;
            var price = doc.data().price;
            var user = userDoc.data().name;
            var image = doc.data().image;
            var docId = doc.id;

            item.innerHTML += "<tr id='item" + index + "' onclick='redirect(" + index + ");'>" +
              "<td class='number text-center'>" + index + "</td>" +
              "<td class='image-contain'><img class='image' src='' " +
              "alt='picture of listing'></td>" +
              "<td class='product'><strong>Product 1</strong><br>This is the product description.</td>" +
              "<td class='date text-right'>Date Posted: </td>" +
              "<td class='price text-right'>$350</td>" +
              "</tr>";
            let currItem = document.getElementById("item" + index);
            currItem.querySelector('.product').innerHTML = bookName + "<br>" + "Posted by: " + user;
            currItem.querySelector('.date').innerHTML = "Date posted:" + date.toDate().toLocaleString();
            currItem.querySelector('.price').innerHTML = "$" + price;
            currItem.querySelector('.image').src = image;
          });
      });

  }
}


function filterByCategory(categoryNum) {
  if (categoryNum == 7) {
    category = undefined;
    loadEveryListing();
    return;
  }
  category = document.getElementById("category-option" + categoryNum).value;
  loadEveryListing();

}

function filterByPrice(priceNum) {
  switch (priceNum) {
    case 1:
      minPrice = 0;
      maxPrice = 99;
      break;
    case 2:
      minPrice = 100;
      maxPrice = 199;
      break;
    case 3:
      minPrice = 200;
      maxPrice = 1000;
      break;
    default:
      minPrice = undefined;
      maxPrice = undefined;
      break;
  }
  loadEveryListing();
}

function moveToOtherPage(num) {
  showListings(num);
}