const canvas = document.getElementById("map");
const ctx = canvas.getContext("2d");

const ui = {
  budget: document.getElementById("budget"),
  co2: document.getElementById("co2"),
  live: document.getElementById("live"),
  panelTitle: document.getElementById("panelTitle"),
  panelBody: document.getElementById("panelBody"),
};

const state = {
  budget: 2_000_000,          
  estateCO2: 9_000_000,       
  estateLivability: 55,       
  selectedHouseId: null,
  houses: [
    
    { id: "A1", x: 90,  y: 90,  w: 110, h: 80, baseCO2: 120000, baseLive: 50, upgrades: {} },
    { id: "A2", x: 240, y: 100, w: 120, h: 75, baseCO2: 115000, baseLive: 52, upgrades: {} },
    { id: "B1", x: 120, y: 210, w: 140, h: 90, baseCO2: 140000, baseLive: 45, upgrades: {} },
    { id: "C1", x: 320, y: 240, w: 150, h: 95, baseCO2: 135000, baseLive: 48, upgrades: {} },
  ],
};


const UPGRADE_CATALOG = [
  {
    key: "loft_insulation",
    name: "Loft insulation",
    cost: 9000,
    co2Delta: -9000,    
    liveDelta: +3,
    notes: "Cheapest win for heat loss.",
  },
  {
    key: "cavity_wall",
    name: "Cavity wall insulation",
    cost: 14000,
    co2Delta: -14000,
    liveDelta: +4,
    notes: "Big savings for older stock (if suitable).",
  },
  {
    key: "double_glazing",
    name: "Double glazing",
    cost: 22000,
    co2Delta: -8000,
    liveDelta: +4,
    notes: "Comfort + noise benefits.",
  },
  {
    key: "heat_pump",
    name: "Air-source heat pump",
    cost: 120000,
    co2Delta: -45000,
    liveDelta: +6,
    notes: "High capex; best with insulation first.",
  },
];

function getHouseById(id) {
  return state.houses.find(h => h.id === id);
}

function computeHouseStats(house) {
  let co2 = house.baseCO2;
  let live = house.baseLive;
  for (const up of UPGRADE_CATALOG) {
    if (house.upgrades[up.key]) {
      co2 += up.co2Delta;
      live += up.liveDelta;
    }
  }
  co2 = Math.max(0, co2);
  live = Math.max(0, Math.min(100, live));
  return { co2, live };
}

function recomputeEstateTotals() {

  let totalCO2 = 0;
  let totalLive = 0;
  for (const h of state.houses) {
    const s = computeHouseStats(h);
    totalCO2 += s.co2;
    totalLive += s.live;
  }
  state.estateCO2 = totalCO2;
  state.estateLivability = Math.round(totalLive / state.houses.length);
}

function refreshHUD() {
  ui.budget.textContent = state.budget.toLocaleString();
  ui.co2.textContent = state.estateCO2.toLocaleString();
  ui.live.textContent = state.estateLivability.toString();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#141821";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#0f1220";
  ctx.fillRect(40, 60, 720, 40);
  ctx.fillRect(70, 170, 680, 35);
  ctx.fillRect(80, 330, 660, 35);

  for (const h of state.houses) {
    const s = computeHouseStats(h);

    ctx.fillStyle = "#1c2436";
    ctx.fillRect(h.x, h.y, h.w, h.h);

    ctx.fillStyle = "#23304a";
    ctx.fillRect(h.x, h.y + h.h + 6, h.w, 8);
    ctx.fillStyle = "#2a67ff";
    ctx.fillRect(h.x, h.y + h.h + 6, Math.round(h.w * (s.live / 100)), 8);

    ctx.fillStyle = "#e8eef5";
    ctx.font = "14px system-ui";
    ctx.fillText(h.id, h.x + 8, h.y + 20);

    if (state.selectedHouseId === h.id) {
      ctx.strokeStyle = "#2a67ff";
      ctx.lineWidth = 3;
      ctx.strokeRect(h.x - 2, h.y - 2, h.w + 4, h.h + 4);
    }
  }
}

function renderPanel() {
  const id = state.selectedHouseId;
  if (!id) {
    ui.panelTitle.textContent = "Click a house";
    ui.panelBody.innerHTML = `<div class="card small">Pick a house on the map to see retrofit options.</div>`;
    return;
  }

  const house = getHouseById(id);
  const stats = computeHouseStats(house);

  ui.panelTitle.textContent = `House ${id}`;
  ui.panelBody.innerHTML = `
    <div class="card">
      <div class="row"><span><b>CO₂</b></span><span>${stats.co2.toLocaleString()} kg/yr</span></div>
      <div class="row"><span><b>Livability</b></span><span>${stats.live}/100</span></div>
      <hr/>
      <div class="small">Choose upgrades (one-time purchase). Numbers are placeholders you’ll calibrate.</div>
    </div>
    ${UPGRADE_CATALOG.map(up => {
      const owned = !!house.upgrades[up.key];
      const canAfford = state.budget >= up.cost;
      const disabled = owned || !canAfford;

      return `
        <div class="card">
          <div class="row">
            <div>
              <div><b>${up.name}</b></div>
              <div class="small">${up.notes}</div>
            </div>
            <div style="text-align:right" class="small">
              <div>£${up.cost.toLocaleString()}</div>
              <div>CO₂ ${up.co2Delta} /yr</div>
              <div>Live +${up.liveDelta}</div>
            </div>
          </div>
          <div style="margin-top:10px">
            <button ${disabled ? "disabled" : ""} data-upgrade="${up.key}">
              ${owned ? "Installed" : (canAfford ? "Install" : "Over budget")}
            </button>
          </div>
        </div>
      `;
    }).join("")}
  `;

  ui.panelBody.querySelectorAll("button[data-upgrade]").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-upgrade");
      applyUpgrade(id, key);
    });
  });
}

function applyUpgrade(houseId, upgradeKey) {
  const house = getHouseById(houseId);
  const up = UPGRADE_CATALOG.find(u => u.key === upgradeKey);
  if (!house || !up) return;
  if (house.upgrades[upgradeKey]) return;
  if (state.budget < up.cost) return;

  state.budget -= up.cost;
  house.upgrades[upgradeKey] = true;

  recomputeEstateTotals();
  refreshHUD();
  draw();
  renderPanel();
}

function pickHouseAt(x, y) {
  for (const h of state.houses) {
    if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) return h.id;
  }
  return null;
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.round((e.clientX - rect.left) * (canvas.width / rect.width));
  const y = Math.round((e.clientY - rect.top) * (canvas.height / rect.height));

  state.selectedHouseId = pickHouseAt(x, y);
  draw();
  renderPanel();
});

// Init
recomputeEstateTotals();
refreshHUD();
draw();
renderPanel();