document.addEventListener("DOMContentLoaded", function () {

  /* =========================
     NAV ACTIVE LINK
  ========================= */
  const links = document.querySelectorAll("nav a");

  links.forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add("active");
    }
  });


  /* =========================
     INVENTORY
  ========================= */

  const productForm = document.getElementById("productForm");
  const productList = document.getElementById("productList");

  let products = JSON.parse(localStorage.getItem("products")) || [];

  function showProducts() {
    if (!productList) return;

    productList.innerHTML = "";

    if (products.length === 0) {
      productList.innerHTML = "<p>No products yet.</p>";
      return;
    }

    products.forEach((product, index) => {
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
    productForm.addEventListener("submit", e => {
      e.preventDefault();

      const name = document.getElementById("productName").value.trim();
      const price = Number(document.getElementById("price").value);
      const stock = Number(document.getElementById("stock").value);

      if (!name || !price || !stock) {
        alert("Please fill in all fields");
        return;
      }

      products.push({ name, price, stock });
      localStorage.setItem("products", JSON.stringify(products));

      productForm.reset();
      showProducts();
      showInventoryRevenue();
    });
  }

  window.removeProduct = function (index) {
    if (!confirm("Are you sure you want to delete this product?")) return;

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
    const inventoryRevenue = document.getElementById("inventoryRevenue");
    if (!inventoryRevenue) return;

    let totalValue = products.reduce((sum, p) => {
      return sum + (Number(p.price) * Number(p.stock));
    }, 0);

    inventoryRevenue.innerHTML = `
      <div class="card">
        <p>Total Products: ${products.length}</p>
        <p style="font-weight:bold; color:green;">
          Stock Value: KES ${totalValue}
        </p>
      </div>
    `;
  }

  showInventoryRevenue();


  /* =========================
     SALES
  ========================= */

  const salesForm = document.getElementById("salesForm");
  const salesList = document.getElementById("salesList");

  let sales = JSON.parse(localStorage.getItem("sales")) || [];

  function showSales() {
    if (!salesList) return;

    salesList.innerHTML = "";

    if (sales.length === 0) {
      salesList.innerHTML = "<p>No sales recorded yet.</p>";
      return;
    }

    sales.forEach((sale, index) => {
      salesList.innerHTML += `
        <div class="card">
          <p>Product: ${sale.product}</p>
          <p>Quantity: ${sale.quantity}</p>
          <p>Amount: KES ${sale.price}</p>
          <button onclick="removeSale(${index})">Delete</button>
        </div>
      `;
    });
  }

  if (salesForm) {
    salesForm.addEventListener("submit", e => {
      e.preventDefault();

      const product = document.getElementById("saleProduct").value.trim();
      const quantity = Number(document.getElementById("quantity").value);
      const price = Number(document.getElementById("salePrice").value);

      if (!product || !quantity || !price) {
        alert("Please fill in all fields");
        return;
      }

      sales.push({ product, quantity, price });
      localStorage.setItem("sales", JSON.stringify(sales));

      salesForm.reset();
      showSales();
      showSalesRevenue();
      showProfitLoss();
    });
  }

  window.removeSale = function (index) {
    if (!confirm("Are you sure you want to delete this sale?")) return;

    sales.splice(index, 1);
    localStorage.setItem("sales", JSON.stringify(sales));

    showSales();
    showSalesRevenue();
    showProfitLoss();
  };

  showSales();


  /* =========================
     SALES REVENUE
  ========================= */

  function showSalesRevenue() {
    const salesRevenue = document.getElementById("salesRevenue");
    if (!salesRevenue) return;

    let totalRevenue = sales.reduce((sum, s) => sum + Number(s.price), 0);
    let average = sales.length ? (totalRevenue / sales.length).toFixed(2) : 0;

    salesRevenue.innerHTML = `
      <div class="card">
        <p>Total Sales: ${sales.length}</p>
        <p>Average Sale: KES ${average}</p>
        <p style="color:green; font-weight:bold;">
          Revenue: KES ${totalRevenue}
        </p>
      </div>
    `;
  }

  showSalesRevenue();


  /* =========================
     EXPENSES
  ========================= */

  const expenseForm = document.getElementById("expenseForm");
  const expenseList = document.getElementById("expenseList");

  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  function showExpenses() {
    if (!expenseList) return;

    expenseList.innerHTML = "";

    if (expenses.length === 0) {
      expenseList.innerHTML = "<p>No expenses recorded yet.</p>";
      return;
    }

    expenses.forEach((expense, index) => {
      expenseList.innerHTML += `
        <div class="card">
          <p>${expense.name}</p>
          <p>KES ${expense.amount}</p>
          <button onclick="removeExpense(${index})">Delete</button>
        </div>
      `;
    });
  }

  if (expenseForm) {
    expenseForm.addEventListener("submit", e => {
      e.preventDefault();

      const name = document.getElementById("expenseName").value.trim();
      const amount = Number(document.getElementById("expenseAmount").value);

      if (!name || !amount) {
        alert("Please fill in all fields");
        return;
      }

      expenses.push({ name, amount });
      localStorage.setItem("expenses", JSON.stringify(expenses));

      expenseForm.reset();
      showExpenses();
      showProfitLoss();
    });
  }

  window.removeExpense = function (index) {
    if (!confirm("Are you sure?")) return;

    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));

    showExpenses();
    showProfitLoss();
  };

  showExpenses();


  /* =========================
     PROFIT / LOSS
  ========================= */

  function showProfitLoss() {
    const div = document.getElementById("profitLoss");
    if (!div) return;

    let totalSales = sales.reduce((sum, s) => sum + Number(s.price), 0);
    let totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    let result = totalSales - totalExpenses;

    div.innerHTML = `
      <div class="card">
        <p>Total Revenue: KES ${totalSales}</p>
        <p>Total Expenses: KES ${totalExpenses}</p>
        <p style="color:${result >= 0 ? "green" : "red"}; font-weight:bold;">
          ${result >= 0 ? "Profit" : "Loss"}: KES ${Math.abs(result)}
        </p>
      </div>
    `;
  }

  showProfitLoss();


  /* =========================
     HOME SUMMARY
  ========================= */

  function showHomeSummary() {
    const home = document.getElementById("homeSummary");
    if (!home) return;

    let totalRevenue = sales.reduce((s, x) => s + Number(x.price), 0);
    let totalExpenses = expenses.reduce((s, x) => s + Number(x.amount), 0);

    let stockValue = products.reduce((s, p) =>
      s + (Number(p.price) * Number(p.stock)), 0);

    let result = totalRevenue - totalExpenses;

    home.innerHTML = `
      <div class="card">
        <p>Products: ${products.length}</p>
        <p>Stock Value: KES ${stockValue}</p>
        <p>Revenue: KES ${totalRevenue}</p>
        <p>Expenses: KES ${totalExpenses}</p>
        <p style="color:${result >= 0 ? "green" : "red"}; font-weight:bold;">
          ${result >= 0 ? "Profit" : "Loss"}: KES ${Math.abs(result)}
        </p>
      </div>
    `;
  }

  showHomeSummary();


  /* =========================
     CONTACT FORM
  ========================= */

  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", e => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();
      const status = document.getElementById("contactStatus");

      if (!name || !email || !message) {
        status.textContent = "Please fill in all fields";
        status.style.color = "red";
        return;
      }

      let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
      contacts.push({ name, email, message });

      localStorage.setItem("contacts", JSON.stringify(contacts));

      status.textContent = "Message sent successfully!";
      status.style.color = "green";

      contactForm.reset();
    });
  }

});