var category;
var maxPrice;
var minPrice;
var everyListingId;
var totalPages;
var sortBy = 'bookId';
var order = 'asc';

function loadEveryListing() {
  everyListingId = [];
  totalPages = 1;
  let i = 1;
  document.getElementById("page-number-goes-here").innerHTML = "<button class='active' onclick='moveToOtherPage(" + 1 + ");'>" + 1 + "</button>";
  db.collection("listings").orderBy(sortBy, order).get()
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
          for (let index = 2; index <= totalPages; index++) {
            document.getElementById("page-number-goes-here").innerHTML += "<button onclick='moveToOtherPage(" + index + ");'>" + index + "</button>";
          }
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
  let maxIndex = (page * 10 > everyListingId.length) ? everyListingId.length : page * 10;
  let minIndex = (page - 1) * 10 + 1;
  for (let index = minIndex; index <= maxIndex; index++) {
    db.collection("listings").doc(everyListingId[index - 1]).get()
      .then(doc => {
        var userId = doc.data().userId;
        item.innerHTML += "<tr id='item" + index + "' onclick='redirect(" + index + ");'>" +
          "<td class='number text-center'>" + index + "</td>" +
          "<td class='image-contain'><img class='image' src='' " +
          "alt='picture of listing'></td>" +
          "<td class='product'><strong>Product 1</strong><br>This is the product description.</td>" +
          "<td class='date text-right'>Date Posted: </td>" +
          "<td class='price text-right'>$350</td>" +
          "</tr>";
        db.collection("users").doc(userId).get()
          .then(userDoc => {
            var user = userDoc.data().name;
            var bookName = doc.data().bookId;
            var date = doc.data().date;
            var price = doc.data().price;
            var image = doc.data().image;
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
  let pageButtons = document.getElementById('page-number-goes-here').children;
  for (let index = 0; index < pageButtons.length; index++) {
    pageButtons[index].classList.remove('active');
  }
  pageButtons[num - 1].classList.add('active');
  showListings(num);
}
function redirect(row) {
  var listingId = everyListingId[row - 1];
  localStorage.setItem('listingDocID', listingId);
  window.location.href = 'details.html';
}
function sortListings() {
  sortBy = document.getElementById('sortby').value;
  loadEveryListing();

}

function changeOrder(num) {
  let buttons = document.querySelectorAll('.material-symbols-outlined');
  for (let index = 0; index < buttons.length; index++) {
    buttons[index].classList.remove('active-order');
  }
  if (num == 1) {
    order = 'asc';
    buttons[0].classList.add('active-order');
  } else if (num == 2) {
    order = 'desc';
    buttons[1].classList.add('active-order');
  }

  loadEveryListing();
}