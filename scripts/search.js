var category;
var maxPrice = 1000;
var minPrice = 0;
var everyListingId;
var totalPages;
var sortBy = 'bookId';
var order = 'asc';

//loads every listing and puts it in an array to be displayed by a different method
function loadEveryListing() {
  everyListingId = [];
  totalPages = 1;
  let i = 1;
  //adds the first page button
  document.getElementById("page-number-goes-here").innerHTML = "<button class='active' onclick='moveToOtherPage(" + 1 + ");'>" + 1 + "</button>";
  //gets the every listing
  db.collection("listings").orderBy(sortBy, order).get()
    .then(allPListings => {
      //goes through everyone of them
      allPListings.forEach(doc => {
        //stores info in variables
        var price = doc.data().price;
        var docId = doc.id;
        var bookCategory = doc.data().category;
        //checks that the listing falls in the price range and category
        if ((category == undefined || category == bookCategory) && (price >= minPrice && price <= maxPrice)) {
          //adds to array
          everyListingId.push(docId);
          i++;
        }
        //if page exceeds 10 adds 1 to total pages
        if (i > totalPages * 10) {
          totalPages++;
          //adds another page button
          for (let index = 2; index <= totalPages; index++) {
            document.getElementById("page-number-goes-here").innerHTML += "<button onclick='moveToOtherPage(" + index + ");'>" + index + "</button>";
          }
        }
      });
      //function that displays listings
      showListings(1);
    });
}
loadEveryListing();

//shows listings in our html the param is which page we want to show
function showListings(page) {
  //the place where listings should be stored
  let item = document.getElementById('listings-go-here');
  //makes it empty
  item.innerHTML = "";
  //if there are no results based on filters show no results
  if (everyListingId.length == 0) {
    item.innerHTML = "<h1>No Results</h1>";
  }
  //baseed on th page we want to show figure out the min and max index of array to show
  //also will check if number of page is less than the power of 20 and shows only until the length of the array
  let maxIndex = (page * 10 > everyListingId.length) ? everyListingId.length : page * 10;
  let minIndex = (page - 1) * 10 + 1;
  for (let index = minIndex; index <= maxIndex; index++) {
    db.collection("listings").doc(everyListingId[index - 1]).get()
      .then(doc => {
        let userId = doc.data().userId;
        //creates new table row with id and onclick set to index
        item.innerHTML += "<tr id='item" + index + "' onclick='redirect(" + index + ");'>" +
          "<td class='number text-center'>" + index + "</td>" +
          "<td class='image-contain'><img class='image' src='' " +
          "alt='picture of listing'></td>" +
          "<td class='product'><strong>Product 1</strong><br>This is the product description.</td>" +
          "<td class='date text-right'>Date Posted: </td>" +
          "<td class='price text-right'>$350</td>" +
          "</tr>";
          //gets posts user data
        db.collection("users").doc(userId).get()
          .then(userDoc => {
            //stores info in variables
            let user = userDoc.data().name;
            let bookName = doc.data().bookId;
            let date = doc.data().date;
            let price = doc.data().price;
            let image = doc.data().image;
            //gets the item in the table
            let currItem = document.getElementById("item" + index);
            //puts the info in our html
            currItem.querySelector('.product').innerHTML = bookName + "<br>" + "Posted by: " + user;
            currItem.querySelector('.date').innerHTML = "Date posted:" + date.toDate().toLocaleString();
            currItem.querySelector('.price').innerHTML = "$" + price;
            currItem.querySelector('.image').src = image;
          });
      });

  }
}

//filters by category and loads the listing ids again when a category is picked
function filterByCategory(categoryNum) {
  if (categoryNum == 7) {
    category = undefined;
    loadEveryListing();
    return;
  }
  category = document.getElementById("category-option" + categoryNum).value;
  loadEveryListing();

}
//filters by price and loads listings again
function filterByPrice() {
  minPrice = document.getElementById('min-range').value;
  maxPrice = document.getElementById('max-range').value;
  loadEveryListing();
}

//changes to a different page of the listings when the buttons are clicked
function moveToOtherPage(num) {
  let pageButtons = document.getElementById('page-number-goes-here').children;
  for (let index = 0; index < pageButtons.length; index++) {
    pageButtons[index].classList.remove('active');
  }
  pageButtons[num - 1].classList.add('active');
  showListings(num);
}

//everytime a listing is clicked redirects to the details page
function redirect(row) {
  var listingId = everyListingId[row - 1];
  localStorage.setItem('listingDocID', listingId);
  window.location.href = 'details.html';
}

//changes based on what feature the listings are ordered by
function sortListings() {
  sortBy = document.getElementById('sortby').value;
  loadEveryListing();

}

//changes if listings are orderd accending or deccending
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

//everytime the range changes updates value if maximum and minimmum price
function changeRangeValue(value, num){
  let min = document.getElementById('min-label');
  let max = document.getElementById('max-label');
  if (num == 1) {
      min.innerHTML = "Min price: $" + value;
      minPrice = value;
  } else if (num == 2) {
      max.innerHTML = "Max price $" + value;
      maxPrice = value;
  }
}
