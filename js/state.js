/**
 * state.js – shared namespace and game state.
 * Everything hangs off the global `Game` object so the project runs by
 * double-clicking index.html (no build step, no ES-module CORS issues).
 */
window.Game = {
  views: {},   // view modules register here: Game.views.battle = { render() }
  logic: {},   // functional stubs live here (see stubs.js)
  ui: {},      // small UI helpers (toast, eggs counter) – see main.js

  // Mock game state. Phase 3 will replace hard-coded values with real data.
  state: {
    screen: "battle",
    eggs: 100,
    questLevel: 1,
    location: "town",
    player: { name: "Hero Chicken", hp: 100, maxHp: 100 },
    inventory: [
      { id: "sword", name: "Wooden Sword", icon: "🗡️", qty: 1 },
      { id: "feed", name: "Golden Feed", icon: "🌾", qty: 3 }
    ],
    furniture: [
      { id: "fridge", name: "Fridge", icon: "🚪" },
      { id: "chest", name: "Chest", icon: "🧰" },
      { id: "bed", name: "Bed", icon: "🛏️" },
      { id: "table", name: "Table", icon: "🪑" }
    ]
  }
};
