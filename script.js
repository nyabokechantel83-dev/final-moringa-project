document.addEventListener("DOMContentLoaded", function () {

  /* ================= NAV ACTIVE LINK ================= */
  let links = document.querySelectorAll("nav a");

  links.forEach(function (link) {
    if (link.href === window.location.href) {
      link.style.color = "black";
    }
  });


  /* ================= INVENTORY ================= */

  let productForm = document.getElementById("productForm");
  let productList = document.getElementById("productList");

  let products = JSON.parse(localStorage.getItem("products")) || [];

  function displayProducts() {
    if (!productList) return;

    productList.innerHTML = "";

    if (products.length === 0) {
      productList.innerHTML = "<p>No products yet.</p>";
      return;
    }

    for (let i = 0; i < products.length; i++) {
      productList.innerHTML += `
        <div class="card">
          <p>Name: ${products[i].name}</p>
          <p>Price: KES ${products[i].price}</p>
          <p>Stock: ${products[i].stock}</p>
          <button onclick="deleteProduct(${i})">Delete</button>
        </div>
      `;
    }
  }

  if (productForm) {
    productForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let name = document.getElementById("productName").value;
      let price = document.getElementById("price").value;
      let stock = document.getElementById("stock").value;

      if (name === "" || price === "" || stock === "") {
        alert("Fill all fields");
        return;
      }

      products.push({ name, price, stock });
      localStorage.setItem("products", JSON.stringify(products));

      productForm.reset();
      displayProducts();
      showInventoryTotal();
    });
  }

  window.deleteProduct = function (index) {
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
    showInventoryTotal();
  };

  displayProducts();


  /* ================= INVENTORY TOTAL ================= */

  function showInventoryTotal() {
    let box = document.getElementById("inventoryRevenue");
    if (!box) return;

    let total = 0;

    for (let i = 0; i < products.length; i++) {
      total = total + (products[i].price * products[i].stock);
    }

    box.innerHTML = `
      <div class="card">
        <p>Total Products: ${products.length}</p>
        <p>Total Stock Value: KES ${total}</p>
      </div>
    `;
  }

  showInventoryTotal();


  /* ================= SALES ================= */

  let salesForm = document.getElementById("salesForm");
  let salesList = document.getElementById("salesList");

  let sales = JSON.parse(localStorage.getItem("sales")) || [];

  function displaySales() {
    if (!salesList) return;

    salesList.innerHTML = "";

    if (sales.length === 0) {
      salesList.innerHTML = "<p>No sales yet.</p>";
      return;
    }

    for (let i = 0; i < sales.length; i++) {
      salesList.innerHTML += `
        <div class="card">
          <p>Product: ${sales[i].product}</p>
          <p>Quantity: ${sales[i].quantity}</p>
          <p>Amount: KES ${sales[i].price}</p>
          <button onclick="deleteSale(${i})">Delete</button>
        </div>
      `;
    }
  }

  if (salesForm) {
    salesForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let product = document.getElementById("saleProduct").value;
      let quantity = document.getElementById("quantity").value;
      let price = document.getElementById("salePrice").value;

      if (product === "" || quantity === "" || price === "") {
        alert("Fill all fields");
        return;
      }

      sales.push({ product, quantity, price });
      localStorage.setItem("sales", JSON.stringify(sales));

      salesForm.reset();
      displaySales();
      showProfitLoss();
    });
  }

  window.deleteSale = function (index) {
    sales.splice(index, 1);
    localStorage.setItem("sales", JSON.stringify(sales));
    displaySales();
    showProfitLoss();
  };

  displaySales();


  /* ================= EXPENSES ================= */

  let expenseForm = document.getElementById("expenseForm");
  let expenseList = document.getElementById("expenseList");

  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  function displayExpenses() {
    if (!expenseList) return;

    expenseList.innerHTML = "";

    if (expenses.length === 0) {
      expenseList.innerHTML = "<p>No expenses yet.</p>";
      return;
    }

    for (let i = 0; i < expenses.length; i++) {
      expenseList.innerHTML += `
        <div class="card">
          <p>${expenses[i].name}</p>
          <p>KES ${expenses[i].amount}</p>
          <button onclick="deleteExpense(${i})">Delete</button>
        </div>
      `;
    }
  }

  if (expenseForm) {
    expenseForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let name = document.getElementById("expenseName").value;
      let amount = document.getElementById("expenseAmount").value;

      if (name === "" || amount === "") {
        alert("Fill all fields");
        return;
      }

      expenses.push({ name, amount });
      localStorage.setItem("expenses", JSON.stringify(expenses));

      expenseForm.reset();
      displayExpenses();
      showProfitLoss();
    });
  }

  window.deleteExpense = function (index) {
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    displayExpenses();
    showProfitLoss();
  };

  displayExpenses();


  /* ================= PROFIT ================= */

  function showProfitLoss() {
    let box = document.getElementById("profitLoss");
    if (!box) return;

    let totalSales = 0;
    let totalExpenses = 0;

    for (let i = 0; i < sales.length; i++) {
      totalSales += Number(sales[i].price);
    }

    for (let i = 0; i < expenses.length; i++) {
      totalExpenses += Number(expenses[i].amount);
    }

    let result = totalSales - totalExpenses;

    box.innerHTML = `
      <div class="card">
        <p>Total Sales: KES ${totalSales}</p>
        <p>Total Expenses: KES ${totalExpenses}</p>
        <p>Profit/Loss: KES ${result}</p>
      </div>
    `;
  }

  showProfitLoss();


  /* ================= HOME SUMMARY ================= */

  function showHomeSummary() {
    let box = document.getElementById("homeSummary");
    if (!box) return;

    let totalSales = 0;
    let totalExpenses = 0;

    for (let i = 0; i < sales.length; i++) {
      totalSales += Number(sales[i].price);
    }

    for (let i = 0; i < expenses.length; i++) {
      totalExpenses += Number(expenses[i].amount);
    }

    let result = totalSales - totalExpenses;

    box.innerHTML = `
      <div class="card">
        <p>Products: ${products.length}</p>
        <p>Sales: ${totalSales}</p>
        <p>Expenses: ${totalExpenses}</p>
        <p>Profit/Loss: ${result}</p>
      </div>
    `;
  }

  showHomeSummary();


  /* ================= CONTACT ================= */

  let contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let name = document.getElementById("name").value;
      let email = document.getElementById("email").value;
      let message = document.getElementById("message").value;

      if (name === "" || email === "" || message === "") {
        alert("Fill all fields");
        return;
      }

      let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

      contacts.push({ name, email, message });

      localStorage.setItem("contacts", JSON.stringify(contacts));

      alert("Message sent!");
      contactForm.reset();
    });
  }

});