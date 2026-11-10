/**
 * views/gacha.js – "Pull gamble" screen (wireframe 2).
 * "Each pull is 10 eggs", chicken on a banner, a "Special" prize slot,
 * and Pull x1 / Pull x10 buttons.
 */
(function (Game) {
  Game.views.gacha = {
    render(root) {
      root.innerHTML = `
        <section class="gacha">
          <h2>Pull</h2>
          <p class="hint">Each pull is 10 eggs.</p>
          <div class="gacha-stage">
            <span>🐓</span>
            <span class="special">Special ◇ 💎</span>
          </div>
          <div class="pull-buttons">
            <button id="pull1">Pull x1</button>
            <button id="pull10">Pull x10</button>
          </div>
          <div class="pull-results" id="pull-results"></div>
        </section>`;

      const out = root.querySelector("#pull-results");
      const doPull = (n) => {
        const r = Game.logic.pull(n); // stub
        if (!r.ok) { Game.ui.toast(r.error); return; }
        Game.ui.updateEggs();
        out.innerHTML = r.items
          .map(i => `<div class="item ${i.special ? "special" : ""}">${i.icon} ${i.name}</div>`)
          .join("");
      };
      root.querySelector("#pull1").onclick = () => doPull(1);
      root.querySelector("#pull10").onclick = () => doPull(10);
    }
  };
})(window.Game);
