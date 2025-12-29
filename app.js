// Data menu
const MENU_ITEMS = [
  { id: "cup-injection", name: "Cup Injection", price: 20000, image: "./products/cup-injection.jpg" },
  { id: "paper-cup", name: "Paper Cup", price: 8000, image: "./products/paper-cup.jpg" },
  { id: "plastik", name: "Plastik", price: 8000, image: "./products/plastik.jpg" },
  { id: "indomilk", name: "Indomilk", price: 15000, image: "./products/indomilk.jpg" },
  { id: "milo", name: "Milo", price: 19000, image: "./products/milo.jpg" },
  { id: "gula", name: "Gula", price: 17500, image: "./products/gula.jpg" },
  { id: "sereal-2in1", name: "Sereal 2in1", price: 18000, image: "./products/sereal-2in1.jpg" },
  { id: "choco-chips", name: "Choco Chips", price: 9000, image: "./products/choco-chips.jpg" },
  { id: "chocolate-pie", name: "Chocolate Pie", price: 20000, image: "./products/chocolate-pie.jpg" },
  { id: "nextar", name: "Nextar", price: 20000, image: "./products/nextar.jpg" },
  { id: "nabati-wafer", name: "Nabati Wafer", price: 17000, image: "./products/nabati-wafer.jpg" },
  { id: "nabati-pasta", name: "Nabati Pasta", price: 13000, image: "./products/nabati-pasta.jpg" },
  { id: "nabati-rolls", name: "Nabati Rolls", price: 9000, image: "./products/nabati-rolls.jpg" },
  { id: "brownies-crispy", name: "Brownies Crispy", price: 20000, image: "./products/brownies-crispy.jpg" },
  { id: "chimi", name: "Chimi", price: 18000, image: "./products/chimi.jpg" },
  { id: "beng-beng", name: "Beng-Beng", price: 38000, image: "./products/beng-beng.jpg" },
  { id: "better", name: "Better", price: 16000, image: "./products/better.jpg" },
  { id: "malkits", name: "Malkist", price: 9000, image: "./products/malkist.jpg" },
  { id: "fruta-gummy", name: "Fruta Gummy", price: 18000, image: "./products/fruta-gummy.jpg" },
  { id: "permen-kis", name: "Permen Kis", price: 7000, image: "./products/permen-kis.jpg" },
  { id: "permen-kopiko", name: "Permen Kopiko", price: 10000, image: "./products/permen-kopiko.jpg" },
  { id: "amo-spark", name: "Amo Spark", price: 20000, image: "./products/amo-spark.jpg" },
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
  const overlay = document.getElementById("overlay");
  const modal = overlay.querySelector(".modal");

  const rect = modal.getBoundingClientRect();
  const scale = 2;

  const canvasAll = await html2canvas(overlay, {
    backgroundColor: null,
    scale,
    useCORS: true,
    scrollX: -window.scrollX,
    scrollY: -window.scrollY,
  });

  // crop ke area modal
  const crop = document.createElement("canvas");
  crop.width = Math.round(rect.width * scale);
  crop.height = Math.round(rect.height * scale);

  const ctx = crop.getContext("2d");
  ctx.drawImage(
    canvasAll,
    Math.round(rect.left * scale),
    Math.round(rect.top * scale),
    Math.round(rect.width * scale),
    Math.round(rect.height * scale),
    0,
    0,
    Math.round(rect.width * scale),
    Math.round(rect.height * scale)
  );

  // filename: "Struk Pesanan 29 Dec 25.jpg"
  const dateStr = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  }).format(new Date());

  const link = document.createElement("a");
  link.download = `Struk Pesanan ${dateStr}.jpg`;
  link.href = crop.toDataURL("image/jpeg", 0.95);
  link.click();
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
