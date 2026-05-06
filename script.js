document.addEventListener("DOMContentLoaded", function () {

// this just highlights whichever page you are on
let links = document.querySelectorAll("nav a");
links.forEach(function (link) {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});

/* =========================
   INVENTORY
========================= */

let productForm = document.getElementById("productForm");
let productList = document.getElementById("productList");

// load products from localStorage, if there are none just start with empty array
let products = JSON.parse(localStorage.getItem("products")) || [];

function showProducts() {
  if (!productList) return;

  productList.innerHTML = "";

  // if no products have been added yet, show a message instead of nothing
  if (products.length === 0) {
    productList.innerHTML = "<p>No products yet.</p>";
    return;
  }

  // loop through each product and create a card for it
  products.forEach(function (product, index) {
    productList.innerHTML += `
      <div class="card">
        <h3>${product.name}</h3>
        <p>Price: KES ${product.price}</p>
        <p>Stock: ${product.stock}</p>
        <button onclick="removeProduct(${index})">Delete</button>
      </div>
    `;
  });
}

if (productForm) {
  productForm.addEventListener("submit", function (e) {
    e.preventDefault(); // stop the page from refreshing

    let name = document.getElementById("productName").value;
    let price = document.getElementById("price").value;
    let stock = document.getElementById("stock").value;

    // check that the user actually filled everything in
    if (name === "" || price === "" || stock === "") {
      alert("Please fill in all fields");
      return;
    }

    // add the new product to the array and save it
    products.push({ name, price, stock });
    localStorage.setItem("products", JSON.stringify(products));

    productForm.reset();
    showProducts();
  });
}

// i put this on window so the delete button inside the card can access it
window.removeProduct = function (index) {

  // just making sure the user didnt click delete by accident
  let confirmed = confirm("Are you sure you want to delete this product?");
  if (!confirmed) return;

  products.splice(index, 1); // remove the product at that position
  localStorage.setItem("products", JSON.stringify(products));
  showProducts();
};

showProducts();

/* =========================
   SALES
========================= */

let salesForm = document.getElementById("salesForm");
let salesList = document.getElementById("salesList");

// same idea as products, load from localStorage or start fresh
let sales = JSON.parse(localStorage.getItem("sales")) || [];

function showSales() {
  if (!salesList) return;

  salesList.innerHTML = "";

  // show a message if no sales have been recorded yet
  if (sales.length === 0) {
    salesList.innerHTML = "<p>No sales recorded yet.</p>";
    return;
  }

  // display each sale as a card
  sales.forEach(function (sale) {
    salesList.innerHTML += `
      <div class="card">
        <p>Product: ${sale.product}</p>
        <p>Quantity: ${sale.quantity}</p>
      </div>
    `;
  });
}

if (salesForm) {
  salesForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let product = document.getElementById("saleProduct").value;
    let quantity = document.getElementById("quantity").value;

    // dont save if fields are empty
    if (product === "" || quantity === "") {
      alert("Please fill in all fields");
      return;
    }

    // save the sale and refresh the list
    sales.push({ product, quantity });
    localStorage.setItem("sales", JSON.stringify(sales));

    salesForm.reset();
    showSales();
  });
}

showSales();

/* =========================
   CONTACT FORM
========================= */

let contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let message = document.getElementById("message").value;
    let status = document.getElementById("contactStatus");

    // all three fields need to be filled
    if (name === "" || email === "" || message === "") {
      status.innerText = "Please fill in all fields";
      status.style.color = "red";
      return;
    }

    // save contact message to localStorage
    let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    contacts.push({ name, email, message });
    localStorage.setItem("contacts", JSON.stringify(contacts));

    // let the user know it worked
    status.innerText = "Message sent!";
    status.style.color = "green";

    contactForm.reset();
  });
}

});