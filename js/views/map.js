/**
 * views/map.js – World map screen (wireframe 4).
 * Winding gold path: forest → town → clouds → Palace. Click a node to travel.
 */
(function (Game) {
  Game.views.map = {
    render(root) {
      const locs = Game.logic.getLocations();
      const pts = locs.map(l => `${l.x},${l.y}`).join(" ");
      root.innerHTML = `
        <section class="map" aria-label="World map">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline points="${pts}" fill="none" stroke="#fbbf3c" stroke-width="1.2"
                      stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"
                      style="stroke-width:5px"/>
          </svg>
          ${locs.map(l => `
            <button class="map-node ${l.id === Game.state.location ? "current" : ""}"
                    data-loc="${l.id}" style="left:${l.x}%;top:${l.y}%">
              ${l.name}<span class="dot"></span>
            </button>`).join("")}
        </section>`;

      root.querySelectorAll(".map-node").forEach(btn => {
        btn.onclick = () => {
          const r = Game.logic.travelTo(btn.dataset.loc); // stub
          if (!r.ok) { Game.ui.toast(r.error); return; }
          Game.ui.toast(`Traveled to ${btn.dataset.loc} (mock)`);
          Game.views.map.render(root); // re-render to move the "current" marker
        };
      });
    }
  };
})(window.Game);
