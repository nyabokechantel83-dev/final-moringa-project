document.addEventListener("DOMContentLoaded", function () {

  // =============================================
  // RETRIEVE ALL DATA FROM localStorage ON LOAD
  // This runs on every page so data is always
  // available across index, inventory and sales
  // =============================================

  let products = JSON.parse(localStorage.getItem("products")) || [];
  let sales = JSON.parse(localStorage.getItem("sales")) || [];
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];


  // =============================================
  // NAV ACTIVE LINK
  // =============================================

  let links = document.querySelectorAll("nav a");
  links.forEach(function (link) {
    if (link.href === window.location.href) {
      link.style.color = "black";
    }
  });


  // =============================================
  // INVENTORY — Store & Retrieve
  // =============================================

  let productForm = document.getElementById("productForm");
  let productList = document.getElementById("productList");

  function displayProducts() {
    if (!productList) return;

    productList.innerHTML = "";

    // RETRIEVE: read products from localStorage and display them
    products = JSON.parse(localStorage.getItem("products")) || [];

    if (products.length === 0) {
      productList.innerHTML = "<p>No products yet. Add one above.</p>";
      return;
    }

    for (let i = 0; i < products.length; i++) {
      productList.innerHTML += `
        <div class="card">
          <p><strong>Name:</strong> ${products[i].name}</p>
          <p><strong>Price:</strong> KES ${products[i].price}</p>
          <p><strong>Stock:</strong> ${products[i].stock} units</p>
          <button onclick="deleteProduct(${i})">Delete</button>
        </div>
      `;
    }
  }

  if (productForm) {
    productForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let name = document.getElementById("productName").value.trim();
      let price = document.getElementById("price").value;
      let stock = document.getElementById("stock").value;

      if (name === "" || price === "" || stock === "") {
        alert("Please fill in all fields.");
        return;
      }

      // STORE: save new product to localStorage
      products.push({ name, price: Number(price), stock: Number(stock) });
      localStorage.setItem("products", JSON.stringify(products));

      productForm.reset();
      displayProducts();
      showInventoryTotal();
      showHomeSummary();
    });
  }

  window.deleteProduct = function (index) {
    // RETRIEVE, update, then STORE back to localStorage
    products = JSON.parse(localStorage.getItem("products")) || [];
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
    showInventoryTotal();
    showHomeSummary();
  };

  displayProducts();


  // =============================================
  // INVENTORY TOTAL VALUE
  // =============================================

  function showInventoryTotal() {
    let box = document.getElementById("inventoryRevenue");
    if (!box) return;

    // RETRIEVE fresh data from localStorage
    products = JSON.parse(localStorage.getItem("products")) || [];

    let total = 0;
    for (let i = 0; i < products.length; i++) {
      total += Number(products[i].price) * Number(products[i].stock);
    }

    box.innerHTML = `
      <div class="card">
        <p><strong>Total Products:</strong> ${products.length}</p>
        <p><strong>Total Stock Value:</strong> KES ${total}</p>
      </div>
    `;
  }

  showInventoryTotal();


  // =============================================
  // SALES — Store & Retrieve
  // =============================================

  let salesForm = document.getElementById("salesForm");
  let salesList = document.getElementById("salesList");

  // Populate the product dropdown from localStorage inventory
  function populateProductDropdown() {
    let select = document.getElementById("saleProduct");
    if (!select) return;

    // RETRIEVE products from localStorage to fill dropdown
    products = JSON.parse(localStorage.getItem("products")) || [];

    select.innerHTML = '<option value="">-- Select a product --</option>';

    for (let i = 0; i < products.length; i++) {
      let opt = document.createElement("option");
      opt.value = products[i].name;
      opt.textContent = products[i].name + " (Stock: " + products[i].stock + ", KES " + products[i].price + " each)";
      opt.dataset.price = products[i].price;
      opt.dataset.stock = products[i].stock;
      select.appendChild(opt);
    }
  }

  // Auto-calculate sale amount when product is selected
  let saleProductSelect = document.getElementById("saleProduct");
  if (saleProductSelect) {
    saleProductSelect.addEventListener("change", function () {
      let selected = this.options[this.selectedIndex];
      let unitPrice = selected.dataset.price || "";
      let qtyInput = document.getElementById("quantity");
      let priceInput = document.getElementById("salePrice");
      if (unitPrice && qtyInput && qtyInput.value) {
        priceInput.value = Number(unitPrice) * Number(qtyInput.value);
      } else if (priceInput) {
        priceInput.value = "";
      }
    });
  }

  // Auto-calculate sale amount when quantity is typed
  let qtyInput = document.getElementById("quantity");
  if (qtyInput) {
    qtyInput.addEventListener("input", function () {
      let select = document.getElementById("saleProduct");
      let priceInput = document.getElementById("salePrice");
      if (!select || !priceInput) return;
      let selected = select.options[select.selectedIndex];
      let unitPrice = selected && selected.dataset.price ? selected.dataset.price : "";
      if (unitPrice && this.value) {
        priceInput.value = Number(unitPrice) * Number(this.value);
      }
    });
  }

  function displaySales() {
    if (!salesList) return;

    // RETRIEVE sales from localStorage and display them
    sales = JSON.parse(localStorage.getItem("sales")) || [];

    salesList.innerHTML = "";

    if (sales.length === 0) {
      salesList.innerHTML = "<p>No sales recorded yet.</p>";
      return;
    }

    for (let i = 0; i < sales.length; i++) {
      salesList.innerHTML += `
        <div class="card">
          <p><strong>Product:</strong> ${sales[i].product}</p>
          <p><strong>Quantity:</strong> ${sales[i].quantity}</p>
          <p><strong>Amount:</strong> KES ${sales[i].price}</p>
          <button onclick="deleteSale(${i})">Delete</button>
        </div>
      `;
    }
  }

  function showSalesRevenue() {
    let box = document.getElementById("salesRevenue");
    if (!box) return;

    // RETRIEVE sales from localStorage
    sales = JSON.parse(localStorage.getItem("sales")) || [];

    let total = 0;
    for (let i = 0; i < sales.length; i++) {
      total += Number(sales[i].price);
    }

    box.innerHTML = `
      <div class="card">
        <p><strong>Total Sales Recorded:</strong> ${sales.length}</p>
        <p><strong>Total Revenue:</strong> KES ${total}</p>
      </div>
    `;
  }

  if (salesForm) {
    salesForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let productName = document.getElementById("saleProduct").value;
      let quantity = Number(document.getElementById("quantity").value);
      let price = document.getElementById("salePrice").value;

      if (productName === "" || !quantity || price === "") {
        alert("Please fill in all fields.");
        return;
      }

      // RETRIEVE products from localStorage to check and update stock
      products = JSON.parse(localStorage.getItem("products")) || [];

      let productIndex = -1;
      for (let i = 0; i < products.length; i++) {
        if (products[i].name.toLowerCase() === productName.toLowerCase()) {
          productIndex = i;
          break;
        }
      }

      if (productIndex === -1) {
        alert("Product not found in inventory. Please add it first.");
        return;
      }

      let currentStock = Number(products[productIndex].stock);
      if (quantity > currentStock) {
        alert("Not enough stock! Available: " + currentStock + " units.");
        return;
      }

      // Deduct stock and STORE updated products back to localStorage
      products[productIndex].stock = currentStock - quantity;
      localStorage.setItem("products", JSON.stringify(products));

      // STORE new sale to localStorage
      sales = JSON.parse(localStorage.getItem("sales")) || [];
      sales.push({ product: productName, quantity, price: Number(price) });
      localStorage.setItem("sales", JSON.stringify(sales));

      salesForm.reset();
      displaySales();
      showSalesRevenue();
      showProfitLoss();
      showHomeSummary();
      populateProductDropdown();
    });
  }

  window.deleteSale = function (index) {
    // RETRIEVE latest data from localStorage
    sales = JSON.parse(localStorage.getItem("sales")) || [];
    products = JSON.parse(localStorage.getItem("products")) || [];

    // Restore stock for the deleted sale
    let sale = sales[index];
    for (let i = 0; i < products.length; i++) {
      if (products[i].name.toLowerCase() === sale.product.toLowerCase()) {
        products[i].stock = Number(products[i].stock) + Number(sale.quantity);
        // STORE updated stock back to localStorage
        localStorage.setItem("products", JSON.stringify(products));
        break;
      }
    }

    // Remove sale and STORE updated sales to localStorage
    sales.splice(index, 1);
    localStorage.setItem("sales", JSON.stringify(sales));

    displaySales();
    showSalesRevenue();
    showProfitLoss();
    showHomeSummary();
    populateProductDropdown();
  };

  displaySales();
  showSalesRevenue();
  populateProductDropdown();


  // =============================================
  // EXPENSES — Store & Retrieve
  // =============================================

  let expenseForm = document.getElementById("expenseForm");
  let expenseList = document.getElementById("expenseList");

  function displayExpenses() {
    if (!expenseList) return;

    // RETRIEVE expenses from localStorage and display them
    expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    expenseList.innerHTML = "";

    if (expenses.length === 0) {
      expenseList.innerHTML = "<p>No expenses recorded yet.</p>";
      return;
    }

    for (let i = 0; i < expenses.length; i++) {
      expenseList.innerHTML += `
        <div class="card">
          <p><strong>${expenses[i].name}</strong></p>
          <p>KES ${expenses[i].amount}</p>
          <button onclick="deleteExpense(${i})">Delete</button>
        </div>
      `;
    }
  }

  if (expenseForm) {
    expenseForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let name = document.getElementById("expenseName").value.trim();
      let amount = document.getElementById("expenseAmount").value;

      if (name === "" || amount === "") {
        alert("Please fill in all fields.");
        return;
      }

      // STORE new expense to localStorage
      expenses = JSON.parse(localStorage.getItem("expenses")) || [];
      expenses.push({ name, amount: Number(amount) });
      localStorage.setItem("expenses", JSON.stringify(expenses));

      expenseForm.reset();
      displayExpenses();
      showProfitLoss();
      showHomeSummary();
    });
  }

  window.deleteExpense = function (index) {
    // RETRIEVE, update, then STORE back to localStorage
    expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    displayExpenses();
    showProfitLoss();
    showHomeSummary();
  };

  displayExpenses();


  // =============================================
  // PROFIT & LOSS
  // =============================================

  function showProfitLoss() {
    let box = document.getElementById("profitLoss");
    if (!box) return;

    // RETRIEVE latest sales and expenses from localStorage
    sales = JSON.parse(localStorage.getItem("sales")) || [];
    expenses = JSON.parse(localStorage.getItem("expenses")) || [];

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
        <p><strong>Total Sales:</strong> KES ${totalSales}</p>
        <p><strong>Total Expenses:</strong> KES ${totalExpenses}</p>
        <p style="color: ${result >= 0 ? 'green' : 'red'}"><strong>Profit/Loss:</strong> KES ${result}</p>
      </div>
    `;
  }

  showProfitLoss();


  // =============================================
  // HOME — Business Summary
  // RETRIEVE all data from localStorage and
  // display a summary on the home page
  // =============================================

  function showHomeSummary() {
    let summaryBox = document.getElementById("summary");
    if (!summaryBox) return;

    // RETRIEVE all three data sets from localStorage
    products = JSON.parse(localStorage.getItem("products")) || [];
    sales = JSON.parse(localStorage.getItem("sales")) || [];
    expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    let totalSalesAmount = 0;
    let totalExpensesAmount = 0;

    for (let i = 0; i < sales.length; i++) {
      totalSalesAmount += Number(sales[i].price);
    }
    for (let i = 0; i < expenses.length; i++) {
      totalExpensesAmount += Number(expenses[i].amount);
    }

    let profit = totalSalesAmount - totalExpensesAmount;

    let totalProductsEl = document.getElementById("totalProducts");
    let totalSalesEl = document.getElementById("totalSales");
    let totalRevenueEl = document.getElementById("totalRevenue");
    let totalExpensesEl = document.getElementById("totalExpenses");
    let profitSummaryEl = document.getElementById("profitSummary");

    if (totalProductsEl) totalProductsEl.textContent = "Total Products: " + products.length;
    if (totalSalesEl) totalSalesEl.textContent = "Total Sales Recorded: " + sales.length;
    if (totalRevenueEl) totalRevenueEl.textContent = "Total Revenue: KES " + totalSalesAmount;
    if (totalExpensesEl) totalExpensesEl.textContent = "Total Expenses: KES " + totalExpensesAmount;
    if (profitSummaryEl) {
      profitSummaryEl.textContent = "Net Profit/Loss: KES " + profit;
      profitSummaryEl.style.color = profit >= 0 ? "green" : "red";
    }
  }

  showHomeSummary();


  // =============================================
  // CONTACT FORM — Store
  // =============================================

  let contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let name = document.getElementById("name").value.trim();
      let email = document.getElementById("email").value.trim();
      let message = document.getElementById("message").value.trim();

      if (name === "" || email === "" || message === "") {
        alert("Please fill in all fields.");
        return;
      }

      // STORE contact message to localStorage
      let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
      contacts.push({ name, email, message });
      localStorage.setItem("contacts", JSON.stringify(contacts));

      alert("Message sent successfully!");
      contactForm.reset();
    });
  }

});