const STORAGE_KEY = "expenseTracker.transactions";
const THEME_KEY = "expenseTracker.theme";

const $ = (selector) => document.querySelector(selector);
const qs = (selector) => Array.from(document.querySelectorAll(selector));

const elements = {
  form: $("#transaction-form"),
  description: $("#description"),
  amount: $("#amount"),
  type: $("#type"),
  balance: $("#balance"),
  income: $("#income"),
  expenses: $("#expenses"),
  historyBody: $("#history-table tbody"),
  historyEmpty: $("#history-empty"),
  search: $("#search"),
  clearAll: $("#clear-all"),
  themeToggle: $("#theme-toggle"),
  themeLabel: $("#theme-toggle .label"),
  summaryChart: $("#summaryChart"),
  sparkline: $("#sparkline"),
  app: $(".app"),
};

const state = {
  transactions: [],
  filter: "",
  theme: "light",
};

function init() {
  loadTheme();
  loadTransactions();
  bindEvents();
  renderAll();
}

function bindEvents() {
  elements.form.addEventListener("submit", handleFormSubmit);
  elements.search.addEventListener("input", handleSearch);
  elements.clearAll.addEventListener("click", handleClearAll);
  elements.themeToggle.addEventListener("click", toggleTheme);
  window.addEventListener("storage", () => {
    loadTransactions();
    renderAll();
  });
}

function handleFormSubmit(event) {
  event.preventDefault();

  const description = elements.description.value.trim();
  const amountValue = parseFloat(elements.amount.value);

  if (!description) {
    showToast("Please add a description.");
    elements.description.focus();
    return;
  }

  if (!amountValue || Number.isNaN(amountValue)) {
    showToast("Enter a valid amount.");
    elements.amount.focus();
    return;
  }

  const type = elements.type.value;
  const amount = Math.abs(amountValue);

  addTransaction({
    id: crypto.randomUUID(),
    description,
    amount,
    type,
    createdAt: new Date().toISOString(),
  });

  elements.form.reset();
  elements.type.value = "expense";
  elements.description.focus();
}

function handleSearch(event) {
  state.filter = event.target.value.trim().toLowerCase();
  renderHistory();
}

function handleClearAll() {
  if (!state.transactions.length) return;
  const confirmed = confirm("Clear all transactions? This cannot be undone.");
  if (!confirmed) return;

  state.transactions = [];
  saveTransactions();
  renderAll();
  showToast("All transactions cleared.");
}

function addTransaction(transaction) {
  state.transactions.unshift(transaction);
  saveTransactions();
  renderAll();
  showToast("Transaction added.");
}

function deleteTransaction(id) {
  state.transactions = state.transactions.filter((tx) => tx.id !== id);
  saveTransactions();
  renderAll();
  showToast("Transaction removed.");
}

function loadTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      state.transactions = [];
      return;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("Invalid data");
    state.transactions = parsed;
  } catch {
    state.transactions = [];
    localStorage.removeItem(STORAGE_KEY);
  }
}

function saveTransactions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
}

function renderAll() {
  renderDashboard();
  renderHistory();
  renderCharts();
}

function renderDashboard() {
  const income = state.transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const expenses = state.transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const balance = income - expenses;

  elements.income.textContent = formatCurrency(income);
  elements.expenses.textContent = formatCurrency(expenses);
  elements.balance.textContent = formatCurrency(balance);
}

function renderHistory() {
  const query = state.filter.toLowerCase();
  const items = state.transactions.filter((tx) => {
    if (!query) return true;
    return (
      tx.description.toLowerCase().includes(query) ||
      tx.type.toLowerCase().includes(query) ||
      formatDate(tx.createdAt).toLowerCase().includes(query)
    );
  });

  elements.historyBody.innerHTML = "";

  if (!items.length) {
    elements.historyEmpty.style.display = "block";
    return;
  }

  elements.historyEmpty.style.display = "none";

  items.forEach((tx) => {
    const row = document.createElement("tr");

    const dateCell = document.createElement("td");
    dateCell.textContent = formatDate(tx.createdAt);
    row.appendChild(dateCell);

    const descCell = document.createElement("td");
    descCell.textContent = tx.description;
    row.appendChild(descCell);

    const amountCell = document.createElement("td");
    amountCell.textContent = formatCurrency(tx.amount);
    amountCell.className = tx.type === "income" ? "tag-income" : "tag-expense";
    amountCell.style.fontWeight = "600";
    row.appendChild(amountCell);

    const typeCell = document.createElement("td");
    const typeTag = document.createElement("span");
    typeTag.className = `history__tag ${tx.type === "income" ? "tag-income" : "tag-expense"}`;
    typeTag.textContent = tx.type;
    typeCell.appendChild(typeTag);
    row.appendChild(typeCell);

    const actionCell = document.createElement("td");
    actionCell.style.textAlign = "right";
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn danger";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteTransaction(tx.id));
    actionCell.appendChild(deleteBtn);
    row.appendChild(actionCell);

    elements.historyBody.appendChild(row);
  });
}

function renderCharts() {
  drawSummaryChart();
  drawSparkline();
}

function drawSummaryChart() {
  const canvas = elements.summaryChart;
  const ctx = canvas.getContext("2d");
  const width = canvas.clientWidth * window.devicePixelRatio;
  const height = canvas.clientHeight * window.devicePixelRatio;
  canvas.width = width;
  canvas.height = height;

  const income = state.transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const expenses = state.transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const max = Math.max(income, expenses, 10);
  const padding = 36 * window.devicePixelRatio;
  const barWidth = 88 * window.devicePixelRatio;
  const gap = 64 * window.devicePixelRatio;

  ctx.clearRect(0, 0, width, height);

  // background grid
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1 * window.devicePixelRatio;
  for (let i = 1; i <= 4; i += 1) {
    const y = padding + ((height - padding * 2) / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  const chartHeight = height - padding * 2;
  const xStart = padding + (width - padding * 2 - barWidth * 2 - gap) / 2;
  const yBase = height - padding;

  const drawBar = (idx, value, color) => {
    const x = xStart + idx * (barWidth + gap);
    const normalized = Math.max(value, 0) / max;
    const barHeight = normalized * chartHeight;
    const y = yBase - barHeight;

    const gradient = ctx.createLinearGradient(0, y, 0, yBase);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "rgba(255,255,255,0.18)");

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.font = `${13 * window.devicePixelRatio}px system-ui`;
    ctx.textAlign = "center";
    ctx.fillText(formatCurrency(value), x + barWidth / 2, y - 12 * window.devicePixelRatio);

    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = `${12 * window.devicePixelRatio}px system-ui`;
    ctx.fillText(idx === 0 ? "Income" : "Expense", x + barWidth / 2, yBase + 18 * window.devicePixelRatio);
  };

  drawBar(0, income, "rgba(34, 197, 94, 0.9)");
  drawBar(1, expenses, "rgba(239, 68, 68, 0.9)");
}

function drawSparkline() {
  const canvas = elements.sparkline;
  const ctx = canvas.getContext("2d");
  const width = canvas.clientWidth * window.devicePixelRatio;
  const height = canvas.clientHeight * window.devicePixelRatio;
  canvas.width = width;
  canvas.height = height;

  const sevenDays = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const daily = sevenDays.map((date) => {
    const dayKey = date.toISOString().slice(0, 10);
    const total = state.transactions.reduce((sum, tx) => {
      const txDay = tx.createdAt.slice(0, 10);
      if (txDay !== dayKey) return sum;
      return sum + (tx.type === "income" ? tx.amount : -tx.amount);
    }, 0);
    return total;
  });

  const min = Math.min(...daily, 0);
  const max = Math.max(...daily, 10);
  const range = max - min || 10;
  const padding = 24 * window.devicePixelRatio;

  ctx.clearRect(0, 0, width, height);

  // draw grid
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1 * window.devicePixelRatio;
  for (let i = 0; i <= 4; i += 1) {
    const y = padding + ((height - padding * 2) / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  ctx.beginPath();
  daily.forEach((value, idx) => {
    const x = padding + ((width - padding * 2) / (daily.length - 1)) * idx;
    const y =
      padding + ((max - value) / range) * (height - padding * 2);
    if (idx === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, "rgba(34, 197, 94, 0.9)");
  gradient.addColorStop(0.6, "rgba(34, 197, 94, 0.6)");
  gradient.addColorStop(1, "rgba(59, 130, 246, 0.8)");

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 3 * window.devicePixelRatio;
  ctx.lineJoin = "round";
  ctx.stroke();

  // dots
  daily.forEach((value, idx) => {
    const x = padding + ((width - padding * 2) / (daily.length - 1)) * idx;
    const y =
      padding + ((max - value) / range) * (height - padding * 2);
    ctx.beginPath();
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.arc(x, y, 4 * window.devicePixelRatio, 0, Math.PI * 2);
    ctx.fill();
  });
}

function formatCurrency(value) {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
}

function formatDate(iso) {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function showToast(message, duration = 2000) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  elements.app.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("toast--visible");
  });

  setTimeout(() => {
    toast.classList.remove("toast--visible");
    toast.addEventListener("transitionend", () => {
      toast.remove();
    });
  }, duration);
}

function toggleTheme() {
  const next = state.theme === "dark" ? "light" : "dark";
  setTheme(next);
}

function setTheme(theme) {
  state.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");

  elements.themeLabel.textContent = theme === "dark" ? "Light" : "Dark";
  elements.themeToggle.querySelector(".icon").textContent = theme === "dark" ? "☀️" : "🌗";

  // Redraw charts to keep the appearance consistent with the current theme.
  renderCharts();
}

function loadTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") {
    setTheme(stored);
    return;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDark ? "dark" : "light");
}

init();
