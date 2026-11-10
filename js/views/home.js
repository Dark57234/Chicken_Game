/**
 * views/home.js – Home room / inventory screen (wireframe 3).
 * Fridge/wardrobe, chest, bed, table + chairs on a green floor.
 * Clicking the chest opens the inventory panel; a button adds furniture.
 */
(function (Game) {
  Game.views.home = {
    render(root) {
      root.innerHTML = `
        <section class="room">
          <div class="room-items" id="room-items">
            <div class="furn" title="Fridge">🚪<small>Fridge</small></div>
            <button class="furn chest" id="chest" title="Open inventory">🧰<small>Chest</small></button>
            <div class="furn" title="Table">🪑<small>Table</small></div>
            <div class="furn" title="Bed">🛏️<small>Bed</small></div>
          </div>
          <p class="room-hint">Click the chest to check your inventory</p>
          <p class="room-hint sub">Inventory and add furniture</p>
          <button class="btn" id="add-furn">+ Add furniture</button>
          <div class="inventory-panel hidden" id="inv-panel"></div>
        </section>`;

      const panel = root.querySelector("#inv-panel");
      root.querySelector("#chest").onclick = () => {
        const items = Game.logic.getInventory(); // stub
        panel.innerHTML = `<h3 class="panel-title">Inventory</h3><ul>` +
          items.map(i => `<li>${i.icon} ${i.name} ×${i.qty}</li>`).join("") + `</ul>`;
        panel.classList.toggle("hidden");
      };
      root.querySelector("#add-furn").onclick = () => {
        const r = Game.logic.addFurniture(); // stub
        if (r.ok) {
          const el = document.createElement("div");
          el.className = "furn";
          el.innerHTML = `${r.item.icon}<small>${r.item.name}</small>`;
          root.querySelector("#room-items").appendChild(el);
          Game.ui.toast(`Added ${r.item.name} (mock)`);
        }
      };
    }
  };
})(window.Game);
