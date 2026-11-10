/**
 * stubs.js – FUNCTIONAL STUBS (Phase 2).
 * Placeholder core-logic functions that return hard-coded / mock values.
 * Views call these instead of real logic; Phase 3 replaces the bodies
 * while keeping the signatures and return shapes stable.
 */
(function (Game) {
  const L = Game.logic;

  /** Battle: player attacks the current enemy. Returns mock damage numbers. */
  L.attack = function (enemyId) {
    // TODO(Phase 3): real damage formula, enemy AI, win/lose conditions
    return { enemyId, damageDealt: 10, damageTaken: 5, enemyHp: 60, enemyDefeated: false };
  };

  /** Quest: info about the current quest shown in the quest box. */
  L.getQuest = function () {
    // TODO(Phase 3): load from quest table by Game.state.questLevel
    return { level: 1, title: "Defeat the Snake and the Fox", enemies: [
      { id: "snake", name: "Snake", icon: "🐍", hp: 60, maxHp: 100 },
      { id: "fox", name: "Fox", icon: "🦊", hp: 80, maxHp: 100 }
    ]};
  };

  /** Gacha: pull `count` times (each pull costs 10 eggs). Mock results only. */
  L.pull = function (count) {
    // TODO(Phase 3): real drop table, rarity odds, pity counter
    const cost = count * 10;
    if (Game.state.eggs < cost) return { ok: false, error: "Not enough eggs!", items: [] };
    Game.state.eggs -= cost;
    const mock = [
      { name: "Straw Hat", icon: "👒", special: false },
      { name: "Tiny Table", icon: "🪑", special: false },
      { name: "Golden Crown", icon: "👑", special: true }
    ];
    const items = Array.from({ length: count }, (_, i) => mock[i % mock.length]);
    return { ok: true, cost, items };
  };

  /** Home: list stored inventory items. */
  L.getInventory = function () {
    // TODO(Phase 3): persist to localStorage
    return Game.state.inventory.slice();
  };

  /** Home: place a new piece of furniture in the room (mock: always succeeds). */
  L.addFurniture = function () {
    // TODO(Phase 3): choose from owned furniture, validate placement
    return { ok: true, item: { id: "plant", name: "Potted Plant", icon: "🪴" } };
  };

  /** Map: travel to a location. Mock: always allowed except the Palace. */
  L.travelTo = function (locationId) {
    // TODO(Phase 3): unlock rules based on quest progress
    if (locationId === "palace") return { ok: false, error: "The Palace is locked. Finish more quests!" };
    Game.state.location = locationId;
    return { ok: true, location: locationId };
  };

  /** Map: static list of locations in path order (forest → town → clouds → palace). */
  L.getLocations = function () {
    return [
      { id: "forest", name: "Forest", x: 8, y: 30 },
      { id: "town", name: "Town", x: 32, y: 78 },
      { id: "clouds", name: "Clouds", x: 62, y: 72 },
      { id: "palace", name: "Palace", x: 92, y: 32 }
    ];
  };
})(window.Game);
