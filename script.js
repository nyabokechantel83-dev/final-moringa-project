document.addEventListener("DOMContentLoaded", function () {

/* =========================
   INVENTORY SYSTEM
========================= */

let productForm = document.getElementById("productForm");
let productList = document.getElementById("productList");

let products = JSON.parse(localStorage.getItem("products")) || [];

function displayProducts() {
if (!productList) return;

productList.innerHTML = "";

products.forEach((product, index) => {
productList.innerHTML += `
<div class="card">
<h3>${product.name}</h3>
<p>Price: KES ${product.price}</p>
<p>Stock: ${product.stock}</p>
<button onclick="deleteProduct(${index})">Delete</button>
</div>
`;
});
}

if (productForm) {
productForm.addEventListener("submit", function (e) {
e.preventDefault();

let name = document.getElementById("productName").value;
let price = document.getElementById("price").value;
let stock = document.getElementById("stock").value;

if (name === "" || price === "" || stock === "") {
alert("Please fill all fields!");
return;
}

products.push({ name, price, stock });
localStorage.setItem("products", JSON.stringify(products));

productForm.reset();
displayProducts();
});
}

window.deleteProduct = function (index) {
products.splice(index, 1);
localStorage.setItem("products", JSON.stringify(products));
displayProducts();
};

displayProducts();


/* =========================
   SALES SYSTEM
========================= */

let salesForm = document.getElementById("salesForm");
let salesList = document.getElementById("salesList");

let sales = JSON.parse(localStorage.getItem("sales")) || [];

function displaySales() {
if (!salesList) return;

salesList.innerHTML = "";

sales.forEach((sale) => {
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

if (product === "" || quantity === "") {
alert("Fill all fields!");
return;
}

sales.push({ product, quantity });
localStorage.setItem("sales", JSON.stringify(sales));

salesForm.reset();
displaySales();
});
}

displaySales();


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

if (name === "" || email === "" || message === "") {
status.innerText = " Please fill all fields!";
status.style.color = "red";
return;
}

let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

contacts.push({ name, email, message });
localStorage.setItem("contacts", JSON.stringify(contacts));

status.innerText = "Message sent successfully!";
status.style.color = "green";

contactForm.reset();
});
}

});