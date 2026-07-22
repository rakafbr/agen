const MENU_ITEMS = [
  {
    id: "cup-injection",
    name: "Cup Injection",
    price: 20000,
    image: "./products/cup-injection.jpg",
  },
  {
    id: "paper-cup",
    name: "Paper Cup",
    price: 8000,
    image: "./products/paper-cup.jpg",
  },
  {
    id: "indomilk",
    name: "Indomilk",
    price: 15000,
    image: "./products/indomilk.jpg",
  },
  //{ id: "milo", name: "Milo", price: 19000, image: "./products/milo.jpg" },
  //{ id: "gula", name: "Gula", price: 17500, image: "./products/gula.jpg" },
  {
    id: "sereal-2in1",
    name: "Sereal 2in1",
    price: 21000,
    image: "./products/sereal-2in1.jpg",
  },
  //{ id: "choco-chips", name: "Choco Chips", price: 9000, image: "./products/choco-chips.jpg" },
  {
    id: "chocolate-pie",
    name: "Chocolate Pie",
    price: 20000,
    image: "./products/chocolate-pie.jpg",
  },
  {
    id: "nextar",
    name: "Nextar",
    price: 20000,
    image: "./products/nextar.jpg",
  },
  {
    id: "nabati-wafer",
    name: "Nabati Wafer",
    price: 17000,
    image: "./products/nabati-wafer.jpg",
  },
  {
    id: "nabati-pasta",
    name: "Nabati Pasta",
    price: 13000,
    image: "./products/nabati-pasta.jpg",
  },
  {
    id: "beng-beng",
    name: "Beng-Beng",
    price: 38000,
    image: "./products/beng-beng.jpg",
  },
  {
    id: "better",
    name: "Better",
    price: 16000,
    image: "./products/better.jpg",
  },
  {
    id: "slai-o'lai",
    name: "Slai O'lai",
    price: 16000,
    image: "./products/slai-o'lai.jpg",
  },
  {
    id: "sari-gandum",
    name: "Sari Gandum",
    price: 21000,
    image: "./products/sari-gandum.jpg",
  },
  {
    id: "arden",
    name: "Arden",
    price: 18000,
    image: "./products/arden.jpg",
  },
  {
    id: "kelapa-cream",
    name: "Kelapa Cream",
    price: 21000,
    image: "./products/kelapa-cream.jpg",
  },
  {
    id: "malkist",
    name: "Malkist",
    price: 9000,
    image: "./products/malkist.jpg",
  },
  //{id: "choki-choki", name: "Choki-Choki", price: 17000, image: "./products/choki-choki.jpg",},
  //{ id: "astor", name: "Astor", price: 17000, image: "./products/astor.jpg"},
  //{ id: "fruta-gummy", name: "Fruta Gummy", price: 18000, image: "./products/fruta-gummy.jpg" },
  {
    id: "permen-kis",
    name: "Permen Kis",
    price: 7000,
    image: "./products/permen-kis.jpg",
  },
  {
    id: "permen-kopiko",
    name: "Permen Kopiko",
    price: 10000,
    image: "./products/permen-kopiko.jpg",
  },
  {
    id: "permen-kopiko-stik",
    name: "Permen Kopiko Stik",
    price: 16000,
    image: "./products/permen-kopiko-stik.jpg",
  },
  {
    id: "amo-spark",
    name: "Amo Spark",
    price: 22000,
    image: "./products/amo-spark.jpg",
  },
  {
    id: "sogo",
    name: "Sogo",
    price: 16500,
    image: "./products/sogo.jpg",
  },
  {
    id: "makaroni-naruto",
    name: "Makaroni Naruto",
    price: 10000,
    image: "./products/makaroni-naruto.jpg",
  },
  {
    id: "odeng",
    name: "Odeng",
    price: 26000,
    image: "./products/odeng.jpg",
  },
  {
    id: "chikuwa",
    name: "Chikuwa",
    price: 25000,
    image: "./products/chikuwa.jpg",
  },
];

const fmt = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

const STATE_KEY = "agen-alamanda-pesanan-v1";
let state = { quantities: {} };

function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(STATE_KEY));
    if (s && typeof s === "object" && s.quantities) state.quantities = s.quantities;
  } catch (e) {
  }
}

function saveState() {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify({ quantities: state.quantities }));
  } catch (e) {
  }
}

const esc = (s) =>
  String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const itemsGrid = document.getElementById("items-grid");
const totalBayarEl = document.getElementById("total-bayar");
const btnHitungStruk = document.getElementById("btn-hitung-struk");
const overlay = document.getElementById("overlay");
const receiptList = document.getElementById("receipt-list");
const receiptTotal = document.getElementById("receipt-total");

function renderMenuItems() {
  itemsGrid.innerHTML = "";

  MENU_ITEMS.forEach((it) => {
    const qty = state.quantities[it.id] || 0;

    const card = document.createElement("article");
    card.className = "card-item";
    card.innerHTML = `
      <div class="item-media" aria-hidden="true"><img src="${it.image}" alt=""></div>
      <div class="item-body">
        <div class="item-title">${esc(it.name)}</div>
        <div class="item-price">${fmt.format(it.price)}</div>
      </div>
      <div class="qty-controls" aria-live="polite">
        <button class="btn-round btn-decr" data-id="${it.id}" type="button" aria-label="Kurangi ${esc(it.name)}">−</button>
        <div class="qty-display" id="qty-${it.id}">${qty}</div>
        <button class="btn-round btn-incr" data-id="${it.id}" type="button" aria-label="Tambah ${esc(it.name)}">+</button>
      </div>
    `;
    itemsGrid.appendChild(card);
  });

  itemsGrid.querySelectorAll(".btn-incr").forEach((b) =>
    b.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      state.quantities[id] = (state.quantities[id] || 0) + 1;
      document.getElementById(`qty-${id}`).textContent = state.quantities[id];
      updateTotalBayar();
      saveState();
    })
  );

  itemsGrid.querySelectorAll(".btn-decr").forEach((b) =>
    b.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      state.quantities[id] = Math.max(0, (state.quantities[id] || 0) - 1);
      document.getElementById(`qty-${id}`).textContent = state.quantities[id];
      updateTotalBayar();
      saveState();
    })
  );
}

function calculateTotalBayar() {
  return MENU_ITEMS.reduce((s, it) => s + (state.quantities[it.id] || 0) * it.price, 0);
}

function updateTotalBayar() {
  const t = calculateTotalBayar();
  totalBayarEl.textContent = fmt.format(t);
  btnHitungStruk.disabled = t === 0;
}

function openReceipt() {
  receiptList.innerHTML = "";
  let total = 0;

  MENU_ITEMS.forEach((it) => {
    const q = state.quantities[it.id] || 0;
    if (q > 0) {
      const sub = q * it.price;
      total += sub;

      const row = document.createElement("div");
      row.className = "receipt-item";
      row.innerHTML = `<div>${q} ${esc(it.name)}</div><div>${fmt.format(
        sub
      )}</div>`;
      receiptList.appendChild(row);
    }
  });

  receiptTotal.textContent = fmt.format(total);
  overlay.style.display = "flex";

  const closeBtn = document.getElementById("close-modal");
  if (closeBtn) closeBtn.focus();
}

function closeReceipt() {
  overlay.style.display = "none";
}

function resetOrder() {
  state.quantities = {};
  renderMenuItems();
  updateTotalBayar();
  closeReceipt();
  saveState();
}

function setupModalHandlers() {
  btnHitungStruk.addEventListener("click", openReceipt);

  document.addEventListener("click", (e) => {
    const closeBtn = e.target.closest("#close-modal, #close-modal-2");
    if (closeBtn) {
      closeReceipt();
      return;
    }

    const resetBtn = e.target.closest("#reset-order");
    if (resetBtn) {
      resetOrder();
      return;
    }
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeReceipt();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.style.display === "flex") closeReceipt();
  });
}

const btnScreenshot = document.getElementById("btn-screenshot");

btnScreenshot.addEventListener("click", async () => {
  const modal = document.querySelector(".modal");

  const canvas = await html2canvas(modal, {
    backgroundColor: "#FFFFFF",
    scale: window.devicePixelRatio || 2,
    useCORS: true,
    scrollX: 0,
    scrollY: 0,
    windowWidth: document.documentElement.clientWidth,
    windowHeight: document.documentElement.clientHeight,
  });

  const dateStr = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const link = document.createElement("a");
  link.download = `Struk Pesanan ${dateStr}.jpg`;
  link.href = canvas.toDataURL("image/jpeg", 0.95);
  link.click();
});

document
  .getElementById("darkModeToggle")
  .addEventListener("click", function () {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const moonIcon = document.querySelector("#darkModeToggle .moon");
    const sunIcon = document.querySelector("#darkModeToggle .sun");

    if (currentTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "light");
      sunIcon.style.animation = "fadeOut 0.5s ease-out forwards";
      moonIcon.style.animation = "fadeIn 0.5s ease-out forwards";
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      moonIcon.style.animation = "fadeOut 0.5s ease-out forwards";
      sunIcon.style.animation = "fadeIn 0.5s ease-out forwards";
    }
  });

function init() {
  loadState();

  MENU_ITEMS.forEach((it) => {
    if (state.quantities[it.id] == null) state.quantities[it.id] = 0;
  });

  renderMenuItems();
  updateTotalBayar();

  overlay.style.display = "none";
  setupModalHandlers();
}

init();
