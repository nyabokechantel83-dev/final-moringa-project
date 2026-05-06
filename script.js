document.addEventListener("DOMContentLoaded", function () {

// highlight the current page in the nav
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

// load products from localStorage, if none start with empty array
let products = JSON.parse(localStorage.getItem("products")) || [];

function showProducts() {
  if (!productList) return;

  productList.innerHTML = "";

  // show message if no products added yet
  if (products.length === 0) {
    productList.innerHTML = "<p>No products yet.</p>";
    return;
  }

  // loop through products and make a card for each one
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
    e.preventDefault();

    let name = document.getElementById("productName").value;
    let price = document.getElementById("price").value;
    let stock = document.getElementById("stock").value;

    // make sure nothing is empty
    if (name === "" || price === "" || stock === "") {
      alert("Please fill in all fields");
      return;
    }

    // save new product and refresh list
    products.push({ name, price, stock });
    localStorage.setItem("products", JSON.stringify(products));

    productForm.reset();
    showProducts();
    showInventoryRevenue(); // update revenue after adding product
  });
}

// put on window so delete button inside card can access it
window.removeProduct = function (index) {

  // ask before deleting so user doesnt lose data by accident
  let confirmed = confirm("Are you sure you want to delete this product?");
  if (!confirmed) return;

  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  showProducts();
  showInventoryRevenue();
};

showProducts();


/* =========================
   INVENTORY REVENUE
========================= */

function showInventoryRevenue() {
  let inventoryRevenue = document.getElementById("inventoryRevenue");
  if (!inventoryRevenue) return;

  // calculate total stock value — price x stock for each product
  let totalValue = 0;
  products.forEach(function (product) {
    totalValue += Number(product.price) * Number(product.stock);
  });

  inventoryRevenue.innerHTML = `
    <div class="card">
      <p>Total Products: ${products.length}</p>
      <p style="font-weight:bold; color:green;">Total Stock Value: KES ${totalValue}</p>
    </div>
  `;
}

showInventoryRevenue();


/* =========================
   SALES
========================= */

let salesForm = document.getElementById("salesForm");
let salesList = document.getElementById("salesList");

// load sales from localStorage or start fresh
let sales = JSON.parse(localStorage.getItem("sales")) || [];

function showSales() {
  if (!salesList) return;

  salesList.innerHTML = "";

  // show message if no sales recorded yet
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
        <p>Amount: KES ${sale.price}</p>
      </div>
    `;
  });
}

if (salesForm) {
  salesForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let product = document.getElementById("saleProduct").value;
    let quantity = document.getElementById("quantity").value;
    let price = document.getElementById("salePrice").value;

    // dont save if fields are empty
    if (product === "" || quantity === "" || price === "") {
      alert("Please fill in all fields");
      return;
    }

    // save sale and refresh list
    sales.push({ product, quantity, price });
    localStorage.setItem("sales", JSON.stringify(sales));

    salesForm.reset();
    showSales();
    showSalesRevenue();
    showProfitLoss();
  });
}

showSales();


/* =========================
   SALES REVENUE
========================= */

function showSalesRevenue() {
  let salesRevenue = document.getElementById("salesRevenue");
  if (!salesRevenue) return;

  // add up all sale amounts
  let totalRevenue = 0;
  sales.forEach(function (sale) {
    totalRevenue += Number(sale.price);
  });

  // work out average sale amount
  let average = sales.length > 0 ? (totalRevenue / sales.length).toFixed(2) : 0;

  salesRevenue.innerHTML = `
    <div class="card">
      <p>Total Sales Made: ${sales.length}</p>
      <p>Average Sale Amount: KES ${average}</p>
      <p style="font-weight:bold; color:green;">Total Revenue: KES ${totalRevenue}</p>
    </div>
  `;
}

showSalesRevenue();


/* =========================
   EXPENSES
========================= */

let expenseForm = document.getElementById("expenseForm");
let expenseList = document.getElementById("expenseList");

// load expenses from localStorage or start fresh
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function showExpenses() {
  if (!expenseList) return;

  expenseList.innerHTML = "";

  // show message if no expenses added yet
  if (expenses.length === 0) {
    expenseList.innerHTML = "<p>No expenses recorded yet.</p>";
    return;
  }

  // display each expense as a card
  expenses.forEach(function (expense, index) {
    expenseList.innerHTML += `
      <div class="card">
        <p>Expense: ${expense.name}</p>
        <p>Amount: KES ${expense.amount}</p>
        <button onclick="removeExpense(${index})">Delete</button>
      </div>
    `;
  });
}

if (expenseForm) {
  expenseForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let name = document.getElementById("expenseName").value;
    let amount = document.getElementById("expenseAmount").value;

    // make sure both fields are filled
    if (name === "" || amount === "") {
      alert("Please fill in all fields");
      return;
    }

    // save expense and refresh list
    expenses.push({ name, amount });
    localStorage.setItem("expenses", JSON.stringify(expenses));

    expenseForm.reset();
    showExpenses();
    showProfitLoss();
  });
}

// delete an expense
window.removeExpense = function (index) {
  let confirmed = confirm("Are you sure you want to delete this expense?");
  if (!confirmed) return;

  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  showExpenses();
  showProfitLoss();
};

showExpenses();


/* =========================
   PROFIT AND LOSS
========================= */

function showProfitLoss() {
  let profitLossDiv = document.getElementById("profitLoss");
  if (!profitLossDiv) return;

  // add up all sales amounts
  let totalSales = 0;
  sales.forEach(function (sale) {
    totalSales += Number(sale.price);
  });

  // add up all expenses
  let totalExpenses = 0;
  expenses.forEach(function (expense) {
    totalExpenses += Number(expense.amount);
  });

  // calculate profit or loss
  let result = totalSales - totalExpenses;

  // green for profit, red for loss
  let color = result >= 0 ? "green" : "red";
  let label = result >= 0 ? "Profit" : "Loss";

  profitLossDiv.innerHTML = `
    <div class="card">
      <p>Total Revenue: KES ${totalSales}</p>
      <p>Total Expenses: KES ${totalExpenses}</p>
      <p style="color:${color}; font-weight:bold;">${label}: KES ${Math.abs(result)}</p>
    </div>
  `;
}

showProfitLoss();


/* =========================
   HOME SUMMARY
========================= */

function showHomeSummary() {
  let homeSummary = document.getElementById("homeSummary");
  if (!homeSummary) return;

  // calculate totals for home page
  let totalRevenue = 0;
  sales.forEach(function (sale) {
    totalRevenue += Number(sale.price);
  });

  let totalExpenses = 0;
  expenses.forEach(function (expense) {
    totalExpenses += Number(expense.amount);
  });

  // total stock value
  let totalStockValue = 0;
  products.forEach(function (product) {
    totalStockValue += Number(product.price) * Number(product.stock);
  });

  let result = totalRevenue - totalExpenses;
  let color = result >= 0 ? "green" : "red";
  let label = result >= 0 ? "Profit" : "Loss";

  homeSummary.innerHTML = `
    <div class="card">
      <p>Total Products: ${products.length}</p>
      <p>Total Stock Value: KES ${totalStockValue}</p>
      <p>Total Revenue: KES ${totalRevenue}</p>
      <p>Total Expenses: KES ${totalExpenses}</p>
      <p style="color:${color}; font-weight:bold;">${label}: KES ${Math.abs(result)}</p>
    </div>
  `;
}

showHomeSummary();


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