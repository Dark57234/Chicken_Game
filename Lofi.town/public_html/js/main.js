const canvas = document.getElementById('space-canvas');
const ctx = canvas.getContext('2d');
const fadeOverlay = document.getElementById('fade-overlay');
const locationTitle = document.getElementById('location-title');
const eggCountDisplay = document.getElementById('egg-count');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Optimized Map Dimensions (480 x 320 for zero lag & crisp pixel scaling)
let mapLoaded = false;
const mapImg = new Image();
mapImg.onload = () => { mapLoaded = true; };
mapImg.src = 'images/Map.png';

const mapWidth = 480;
const mapHeight = 320;
const zoomLevel = 3.0; // Clean upscale factor for 480x320 maps

// Chicken Sprite Asset
let chickenLoaded = false;
const chickenImg = new Image();
chickenImg.onload = () => { chickenLoaded = true; };
chickenImg.src = 'images/OriChicken.png';

let eggs = 1250;
const unlockedFurniture = new Set();
const equippedWeapon = { name: null, icon: null };

const quests = [
  { 
    id: 'forest_unlock', 
    title: '🌲 Whispering Woods Expedition', 
    description: 'Explore the dark forest border on the right edge of town.', 
    completed: false 
  }
];

const gachaPool = [
  { id: 'fireplace', name: 'Cozy Fireplace', type: 'furniture', icon: '🔥', rare: true },
  { id: 'bookshelf', name: 'Oak Bookshelf', type: 'furniture', icon: '📚', rare: false },
  { id: 'plant', name: 'Potted Plant', type: 'furniture', icon: '🪴', rare: false },
  { id: 'armchair', name: 'Velvet Armchair', type: 'furniture', icon: '🪑', rare: false },
  { id: 'sword', name: 'Wooden Sword', type: 'weapon', icon: '🗡️', rare: false },
  { id: 'wand', name: 'Magic Wand', type: 'weapon', icon: '🪄', rare: true },
  { id: 'shield', name: 'Egg Shield', type: 'weapon', icon: '🛡️', rare: false }
];

const furnitureLocations = {
  fireplace: { x: 380, y: 160, width: 40, height: 30, color: '#e76f51', label: '🔥' },
  bookshelf: { x: 215, y: 160, width: 50, height: 30, color: '#5c3a21', label: '📚' },
  plant:     { x: 560, y: 170, width: 30, height: 30, color: '#2a9d8f', label: '🪴' },
  armchair:  { x: 260, y: 350, width: 45, height: 45, color: '#e9c46a', label: '🪑' }
};

const playerSize = 24;
let currentScene = 'town';
let isTransitioning = false;

// Player position scaled to 480x320 map coordinates
const townPlayer = { x: 70, y: 70, speed: 3 };
const housePlayer = { x: 400, y: 440, speed: 4 };
const forestPlayer = { x: 400, y: 440, speed: 4 };

let facingDirection = 1;
const keys = {};

// Scaled Triggers for 480x320
const chickenHouseDoor = { x: 60, y: 45, width: 25, height: 20 }; 
const forestEntranceZone = { x: 410, y: 0, width: 70, height: 320 };

// Scaled Collision Obstacles for 480x320
const obstacles = [
  { x: 10, y: 10, w: 80, h: 50 },
  { x: 170, y: 10, w: 70, h: 50 },
  { x: 260, y: 10, w: 80, h: 40 },
  { x: 10, y: 140, w: 60, h: 50 },
  { x: 5, y: 260, w: 90, h: 60 },
  { x: 230, y: 260, w: 90, h: 60 },
  // Map Outer Borders (Prevents walking off screen)
  { x: -20, y: -20, w: 20, h: mapHeight + 40 }, 
  { x: -20, y: -20, w: mapWidth + 40, h: 20 },  
  { x: -20, y: mapHeight - 5, w: mapWidth + 40, h: 20 } 
];

const cabinBounds = { x: 200, y: 150, width: 400, height: 350 };
const cabinExitMat = { x: 370, y: 470, width: 60, height: 20 };

const forestBounds = { x: 200, y: 150, width: 400, height: 350 };
const forestExitMat = { x: 370, y: 470, width: 60, height: 20 };

window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function updateEggDisplay() {
  eggCountDisplay.innerText = `🥚 ${eggs.toLocaleString()} Eggs`;
}

// Gacha Modal
const gachaModal = document.getElementById('gacha-modal');
const openPullBtn = document.getElementById('open-pull-btn');
const closeGachaBtn = document.getElementById('close-gacha-btn');
const pull1Btn = document.getElementById('pull-1-btn');
const pull10Btn = document.getElementById('pull-10-btn');
const gachaMainView = document.getElementById('gacha-main-view');
const gachaResultView = document.getElementById('gacha-result-view');
const resultsContainer = document.getElementById('results-container');
const claimResultsBtn = document.getElementById('claim-results-btn');

openPullBtn.addEventListener('click', () => gachaModal.classList.add('active'));
closeGachaBtn.addEventListener('click', () => gachaModal.classList.remove('active'));

function performPulls(count) {
  const cost = count * 10;
  if (eggs < cost) {
    alert('Not enough Eggs!');
    return;
  }

  eggs -= cost;
  updateEggDisplay();

  const pulledItems = [];
  for (let i = 0; i < count; i++) {
    const item = gachaPool[Math.floor(Math.random() * gachaPool.length)];
    pulledItems.push(item);

    if (item.type === 'furniture') {
      unlockedFurniture.add(item.id);
    } else if (item.type === 'weapon') {
      equippedWeapon.name = item.name;
      equippedWeapon.icon = item.icon;
    }
  }

  resultsContainer.innerHTML = '';
  pulledItems.forEach(item => {
    const div = document.createElement('div');
    div.className = `reward-item ${item.rare ? 'rare' : ''}`;
    div.innerHTML = `<div style="font-size: 1.5rem;">${item.icon}</div><div>${item.name}</div>`;
    resultsContainer.appendChild(div);
  });

  gachaMainView.style.display = 'none';
  gachaResultView.style.display = 'block';
}

pull1Btn.addEventListener('click', () => performPulls(1));
pull10Btn.addEventListener('click', () => performPulls(10));

claimResultsBtn.addEventListener('click', () => {
  gachaResultView.style.display = 'none';
  gachaMainView.style.display = 'block';
  gachaModal.classList.remove('active');
});

// Quests Modal
const questsModal = document.getElementById('quests-modal');
const openQuestsBtn = document.getElementById('open-quests-btn');
const closeQuestsBtn = document.getElementById('close-quests-btn');
const questListContainer = document.getElementById('quest-list-container');

openQuestsBtn.addEventListener('click', () => {
  renderQuestList();
  questsModal.classList.add('active');
});
closeQuestsBtn.addEventListener('click', () => questsModal.classList.remove('active'));

function renderQuestList() {
  questListContainer.innerHTML = '';
  quests.forEach(q => {
    const div = document.createElement('div');
    div.className = `quest-card ${q.completed ? 'completed' : ''}`;
    div.innerHTML = `
      <div>
        <strong>${q.title}</strong>
        <p style="font-size: 0.8rem; color: #6c757d; margin-top: 2px;">${q.description}</p>
        <span style="font-size: 0.75rem; font-weight: 700; color: ${q.completed ? '#2a9d8f' : '#e76f51'};">
          ${q.completed ? '✓ Completed' : '🔒 Locked (Action Required)'}
        </span>
      </div>
      ${!q.completed ? `<button class="btn-pull" style="padding: 6px 12px; font-size: 0.8rem;" onclick="completeQuest('${q.id}')">Unlock</button>` : ''}
    `;
    questListContainer.appendChild(div);
  });
}

window.completeQuest = function(id) {
  const quest = quests.find(q => q.id === id);
  if (quest) {
    quest.completed = true;
    renderQuestList();
    alert('Quest completed! The Whispering Woods are now unlocked.');
  }
};

function transitionTo(targetScene) {
  if (isTransitioning) return;
  isTransitioning = true;
  fadeOverlay.style.opacity = '1';

  setTimeout(() => {
    currentScene = targetScene;
    if (targetScene === 'town') locationTitle.innerText = 'CHICKEN TOWN';
    else if (targetScene === 'house') locationTitle.innerText = 'WOODEN CABIN';
    else if (targetScene === 'forest') locationTitle.innerText = 'WHISPERING WOODS';

    if (targetScene === 'house') {
      housePlayer.x = 400; housePlayer.y = 440;
    } else if (targetScene === 'forest') {
      forestPlayer.x = 400; forestPlayer.y = 440;
    } else if (targetScene === 'town') {
      townPlayer.x = 70; townPlayer.y = 70;
    }

    setTimeout(() => {
      fadeOverlay.style.opacity = '0';
      isTransitioning = false;
    }, 200);
  }, 400);
}

function checkCollision(newX, newY) {
  const pr = playerSize / 3; 
  for (const obs of obstacles) {
    if (newX + pr > obs.x && newX - pr < obs.x + obs.w &&
        newY + pr > obs.y && newY - pr < obs.y + obs.h) {
      return true;
    }
  }
  return false;
}

function update() {
  if (isTransitioning || gachaModal.classList.contains('active') || questsModal.classList.contains('active')) return;

  if (currentScene === 'town') {
    const speed = townPlayer.speed;
    let dx = 0, dy = 0;

    if (keys['arrowup'] || keys['w']) dy -= speed;
    if (keys['arrowdown'] || keys['s']) dy += speed;
    if (keys['arrowleft'] || keys['a']) { dx -= speed; facingDirection = -1; }
    if (keys['arrowright'] || keys['d']) { dx += speed; facingDirection = 1; }

    let nextX = townPlayer.x + dx;
    let nextY = townPlayer.y + dy;

    if (!checkCollision(nextX, townPlayer.y)) townPlayer.x = nextX;
    if (!checkCollision(townPlayer.x, nextY)) townPlayer.y = nextY;

    if (townPlayer.x >= chickenHouseDoor.x && townPlayer.x <= chickenHouseDoor.x + chickenHouseDoor.width &&
        townPlayer.y >= chickenHouseDoor.y && townPlayer.y <= chickenHouseDoor.y + chickenHouseDoor.height) {
      transitionTo('house');
    }

    if (townPlayer.x > forestEntranceZone.x) {
      const forestQuest = quests.find(q => q.id === 'forest_unlock');
      if (!forestQuest.completed) {
        alert('🔒 The path into the Whispering Woods is blocked! Complete the quest in your Quests menu to unlock it.');
        townPlayer.x = forestEntranceZone.x - 10;
      } else {
        transitionTo('forest');
      }
    }

  } else if (currentScene === 'house') {
    const speed = housePlayer.speed;
    let dx = 0, dy = 0;

    if (keys['arrowup'] || keys['w']) dy -= speed;
    if (keys['arrowdown'] || keys['s']) dy += speed;
    if (keys['arrowleft'] || keys['a']) { dx -= speed; facingDirection = -1; }
    if (keys['arrowright'] || keys['d']) { dx += speed; facingDirection = 1; }

    housePlayer.x = Math.max(cabinBounds.x + 20, Math.min(cabinBounds.x + cabinBounds.width - 20, housePlayer.x + dx));
    housePlayer.y = Math.max(cabinBounds.y + 30, Math.min(cabinBounds.y + cabinBounds.height - 10, housePlayer.y + dy));

    if (Math.abs(housePlayer.x - (cabinExitMat.x + 30)) < 30 &&
        Math.abs(housePlayer.y - (cabinExitMat.y + 10)) < 20) {
      transitionTo('town');
    }

  } else if (currentScene === 'forest') {
    const speed = forestPlayer.speed;
    let dx = 0, dy = 0;

    if (keys['arrowup'] || keys['w']) dy -= speed;
    if (keys['arrowdown'] || keys['s']) dy += speed;
    if (keys['arrowleft'] || keys['a']) { dx -= speed; facingDirection = -1; }
    if (keys['arrowright'] || keys['d']) { dx += speed; facingDirection = 1; }

    forestPlayer.x = Math.max(forestBounds.x + 20, Math.min(forestBounds.x + forestBounds.width - 20, forestPlayer.x + dx));
    forestPlayer.y = Math.max(forestBounds.y + 30, Math.min(forestBounds.y + forestBounds.height - 10, forestPlayer.y + dy));

    if (Math.abs(forestPlayer.x - (forestExitMat.x + 30)) < 30 &&
        Math.abs(forestPlayer.y - (forestExitMat.y + 10)) < 20) {
      transitionTo('town');
    }
  }
}

function draw() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  ctx.imageSmoothingEnabled = false; // Ensures crystal-clear pixel art

  if (currentScene === 'town') {
    ctx.fillStyle = '#5b8c3d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Smooth camera follow centered on chicken with 3x upscale zoom
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(zoomLevel, zoomLevel);
    ctx.translate(-townPlayer.x, -townPlayer.y);

    if (mapLoaded) {
      ctx.drawImage(mapImg, 0, 0, mapWidth, mapHeight);
    } else {
      ctx.fillStyle = '#82c151';
      ctx.fillRect(0, 0, mapWidth, mapHeight);
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Loading Map...', mapWidth / 2, mapHeight / 2);
    }

    drawChicken(townPlayer.x, townPlayer.y);
    ctx.restore();

  } else if (currentScene === 'house') {
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const roomOffsetX = centerX - 400;
    const roomOffsetY = centerY - 300;

    ctx.save();
    ctx.translate(roomOffsetX, roomOffsetY);

    ctx.fillStyle = '#a06a3b';
    ctx.beginPath(); ctx.roundRect(cabinBounds.x, cabinBounds.y, cabinBounds.width, cabinBounds.height, 12); ctx.fill();

    ctx.strokeStyle = '#5c3a21';
    ctx.lineWidth = 12; ctx.stroke();

    ctx.fillStyle = '#e76f51';
    ctx.beginPath(); ctx.roundRect(cabinExitMat.x, cabinExitMat.y, cabinExitMat.width, cabinExitMat.height, 4); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.font = '600 10px Inter, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('EXIT', cabinExitMat.x + 30, cabinExitMat.y + 13);

    unlockedFurniture.forEach(id => {
      const item = furnitureLocations[id];
      if (item) {
        ctx.fillStyle = item.color;
        ctx.beginPath(); ctx.roundRect(item.x, item.y, item.width, item.height, 6); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = '16px Inter, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(item.label, item.x + item.width / 2, item.y + item.height / 2 + 5);
      }
    });

    drawChicken(housePlayer.x, housePlayer.y);
    ctx.restore();

  } else if (currentScene === 'forest') {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const roomOffsetX = centerX - 400;
    const roomOffsetY = centerY - 300;

    ctx.save();
    ctx.translate(roomOffsetX, roomOffsetY);

    ctx.fillStyle = '#1e293b';
    ctx.beginPath(); ctx.roundRect(forestBounds.x, forestBounds.y, forestBounds.width, forestBounds.height, 12); ctx.fill();

    ctx.strokeStyle = '#090d16';
    ctx.lineWidth = 12; ctx.stroke();

    ctx.fillStyle = '#e76f51';
    ctx.beginPath(); ctx.roundRect(forestExitMat.x, forestExitMat.y, forestExitMat.width, forestExitMat.height, 4); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.font = '600 10px Inter, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('EXIT', forestExitMat.x + 30, forestExitMat.y + 13);

    ctx.fillStyle = '#065f46';
    ctx.beginPath(); ctx.arc(260, 210, 30, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(540, 210, 30, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#34d399'; ctx.font = '700 14px Inter, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('✨ Deep Whispering Woods ✨', forestBounds.x + forestBounds.width / 2, forestBounds.y + 60);

    drawChicken(forestPlayer.x, forestPlayer.y);
    ctx.restore();
  }
}

function drawChicken(x, y) {
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.beginPath();
  ctx.ellipse(x, y + playerSize / 2 - 2, 10, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(x, y);

  if (facingDirection === -1) {
    ctx.scale(-1, 1);
  }

  if (chickenLoaded) {
    ctx.drawImage(chickenImg, -playerSize / 2, -playerSize / 2, playerSize, playerSize);
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, playerSize / 2, 0, Math.PI * 2); ctx.fill();
  }

  if (equippedWeapon.icon) {
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText(equippedWeapon.icon, 8, 4);
  }

  ctx.restore();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
