document.addEventListener("DOMContentLoaded", function () {

let links = document.querySelectorAll("nav a");
links.forEach(function (link) {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});


/* INVENTORY */

let productForm = document.getElementById("productForm");
let productList = document.getElementById("productList");

let products = JSON.parse(localStorage.getItem("products")) || [];

function showProducts() {
  if (!productList) return;

  productList.innerHTML = "";

  if (products.length === 0) {
    productList.innerHTML = "<p>No products yet.</p>";
    return;
  }

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
    let price = Number(document.getElementById("price").value);
    let stock = Number(document.getElementById("stock").value);

    if (name === "" || price <= 0 || stock <= 0) {
      alert("Please fill in all fields");
      return;
    }

    products.push({ name, price, stock });
    localStorage.setItem("products", JSON.stringify(products));

    productForm.reset();
    showProducts();
    showInventoryRevenue();
    showHomeSummary();
  });
}

window.removeProduct = function (index) {
  let confirmed = confirm("Delete this product?");
  if (!confirmed) return;

  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  showProducts();
  showInventoryRevenue();
  showHomeSummary();
};

showProducts();


function showInventoryRevenue() {
  let inventoryRevenue = document.getElementById("inventoryRevenue");
  if (!inventoryRevenue) return;

  let totalValue = 0;

  products.forEach(function (product) {
    totalValue += Number(product.price) * Number(product.stock);
  });

  inventoryRevenue.innerHTML = `
    <div class="card">
      <p>Total Products: ${products.length}</p>
      <p>Total Stock Value: KES ${totalValue}</p>
    </div>
  `;
}

showInventoryRevenue();


/* SALES */

let salesForm = document.getElementById("salesForm");
let salesList = document.getElementById("salesList");

let sales = JSON.parse(localStorage.getItem("sales")) || [];

function showSales() {
  if (!salesList) return;

  salesList.innerHTML = "";

  if (sales.length === 0) {
    salesList.innerHTML = "<p>No sales recorded yet.</p>";
    return;
  }

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
    let quantity = Number(document.getElementById("quantity").value);
    let price = Number(document.getElementById("salePrice").value);

    if (product === "" || quantity <= 0 || price <= 0) {
      alert("Please fill in all fields");
      return;
    }

    sales.push({
      product: product,
      quantity: quantity,
      price: price
    });

    localStorage.setItem("sales", JSON.stringify(sales));

    salesForm.reset();
    showSales();
    showSalesRevenue();
    showProfitLoss();
    showHomeSummary();
  });
}

showSales();


function showSalesRevenue() {
  let salesRevenue = document.getElementById("salesRevenue");
  if (!salesRevenue) return;

  let totalRevenue = 0;

  sales.forEach(function (sale) {
    totalRevenue += Number(sale.price) || 0;
  });

  let average = sales.length > 0 ? (totalRevenue / sales.length).toFixed(2) : 0;

  salesRevenue.innerHTML = `
    <div class="card">
      <p>Total Sales Made: ${sales.length}</p>
      <p>Average Sale Amount: KES ${average}</p>
      <p>Total Revenue: KES ${totalRevenue}</p>
    </div>
  `;
}

showSalesRevenue();


/* EXPENSES */

let expenseForm = document.getElementById("expenseForm");
let expenseList = document.getElementById("expenseList");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function showExpenses() {
  if (!expenseList) return;

  expenseList.innerHTML = "";

  if (expenses.length === 0) {
    expenseList.innerHTML = "<p>No expenses recorded yet.</p>";
    return;
  }

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
    let amount = Number(document.getElementById("expenseAmount").value);

    if (name === "" || amount <= 0) {
      alert("Please fill in all fields");
      return;
    }

    expenses.push({ name, amount });
    localStorage.setItem("expenses", JSON.stringify(expenses));

    expenseForm.reset();
    showExpenses();
    showProfitLoss();
    showHomeSummary();
  });
}

window.removeExpense = function (index) {
  let confirmed = confirm("Delete this expense?");
  if (!confirmed) return;

  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  showExpenses();
  showProfitLoss();
  showHomeSummary();
};

showExpenses();


/* PROFIT LOSS */

function showProfitLoss() {
  let profitLossDiv = document.getElementById("profitLoss");
  if (!profitLossDiv) return;

  let totalSales = 0;
  sales.forEach(function (sale) {
    totalSales += Number(sale.price) || 0;
  });

  let totalExpenses = 0;
  expenses.forEach(function (expense) {
    totalExpenses += Number(expense.amount) || 0;
  });

  let result = totalSales - totalExpenses;

  let color = result >= 0 ? "green" : "red";
  let label = result >= 0 ? "Profit" : "Loss";

  profitLossDiv.innerHTML = `
    <div class="card">
      <p>Total Revenue: KES ${totalSales}</p>
      <p>Total Expenses: KES ${totalExpenses}</p>
      <p style="color:${color};">${label}: KES ${Math.abs(result)}</p>
    </div>
  `;
}

showProfitLoss();


/* HOME SUMMARY */

function showHomeSummary() {
  let homeSummary = document.getElementById("homeSummary");
  if (!homeSummary) return;

  let totalRevenue = 0;
  sales.forEach(function (sale) {
    totalRevenue += Number(sale.price) || 0;
  });

  let totalExpenses = 0;
  expenses.forEach(function (expense) {
    totalExpenses += Number(expense.amount) || 0;
  });

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
      <p style="color:${color};">${label}: KES ${Math.abs(result)}</p>
    </div>
  `;
}

showHomeSummary();


/* CONTACT FORM */

let contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let message = document.getElementById("message").value;
    let status = document.getElementById("contactStatus");

    if (name === "" || email === "" || message === "") {
      status.innerText = "Please fill in all fields";
      status.style.color = "red";
      return;
    }

    status.innerText = "Message sent!";
    status.style.color = "green";

    contactForm.reset();
  });
}

});