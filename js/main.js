/**
 * main.js – router and UI helpers.
 * Responsibilities: switch screens from the nav bar, keep the egg counter
 * in sync, and show toast messages. Contains no game rules.
 */
(function (Game) {
  const screenEl = document.getElementById("screen");
  const navEl = document.getElementById("nav");
  const toastEl = document.getElementById("toast");
  let toastTimer = null;

  /** Show a short message at the bottom of the screen. */
  Game.ui.toast = function (msg) {
    toastEl.textContent = msg;
    toastEl.classList.remove("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.add("hidden"), 2200);
  };

  /** Refresh the egg counter in the top bar. */
  Game.ui.updateEggs = function () {
    document.getElementById("egg-count").textContent = Game.state.eggs;
  };

  /** Switch to a screen by name (battle | gacha | home | map). */
  Game.navigate = function (name) {
    const view = Game.views[name];
    if (!view) { Game.ui.toast(`Unknown screen: ${name}`); return; }
    Game.state.screen = name;
    navEl.querySelectorAll("button").forEach(b =>
      b.classList.toggle("active", b.dataset.screen === name));
    view.render(screenEl);
    Game.ui.updateEggs();
  };

  navEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-screen]");
    if (btn) Game.navigate(btn.dataset.screen);
  });

  Game.navigate(Game.state.screen);
})(window.Game);
