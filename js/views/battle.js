/**
 * views/battle.js – Quest/Battle screen (wireframe 1).
 * Sky + clouds + sun, grass ground, quest box, house button (→ Home),
 * hero chicken with sword, snake and fox enemies with health bars.
 */
(function (Game) {
  Game.views.battle = {
    render(root) {
      const quest = Game.logic.getQuest();
      const [snake, fox] = quest.enemies;
      root.innerHTML = `
        <section class="scene" aria-label="Quest battle scene">
          <div class="quest-box">quest<span>${quest.level}</span></div>
          <button class="home-btn" id="to-home" title="Go home">🏠</button>
          <div class="sun">☀️</div>
          <div class="cloud c1">☁️</div><div class="cloud c2">☁️</div><div class="cloud c3">☁️</div>

          <div class="fighter player">
            <div class="hp-bar"><i style="width:100%"></i></div>
            🐔<span>🗡️</span><small>${Game.state.player.name}</small>
          </div>
          <div class="fighter snake" data-enemy="${snake.id}">
            <div class="hp-bar"><i style="width:${snake.hp}%"></i></div>
            ${snake.icon}<small>${snake.name}</small>
          </div>
          <div class="fighter fox" data-enemy="${fox.id}">
            <div class="hp-bar"><i style="width:${fox.hp}%"></i></div>
            ${fox.icon}<small>${fox.name}</small>
          </div>
        </section>
        <div class="battle-controls">
          <button id="attack-btn">⚔️ Attack</button>
          <span class="battle-log" id="battle-log">${quest.title}</span>
        </div>`;

      root.querySelector("#to-home").onclick = () => Game.navigate("home");
      root.querySelector("#attack-btn").onclick = () => {
        const r = Game.logic.attack("snake"); // stub result
        root.querySelector("#battle-log").textContent =
          `You dealt ${r.damageDealt} damage and took ${r.damageTaken}.`;
      };
    }
  };
})(window.Game);
