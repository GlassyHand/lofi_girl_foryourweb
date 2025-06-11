// Todo List Functionality
const todoButton = document.querySelector('.todo-button:not(.side-menu-btn)');
const todoPanel = document.querySelector('.todo-panel');
const closeBtn = document.querySelector('.close-btn');
const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodo');
const todoList = document.getElementById('todoList');

// Toggle Todo Panel
function showTodoPanel() {
    todoPanel.style.opacity = '1';
    todoPanel.style.pointerEvents = 'all';
    todoPanel.style.transform = 'translateY(0)';
}

function hideTodoPanel() {
    todoPanel.style.opacity = '0';
    todoPanel.style.pointerEvents = 'none';
    todoPanel.style.transform = 'translateY(30px)';
}

todoButton.addEventListener('click', (e) => {
    e.stopPropagation();
    if (todoPanel.style.opacity === '1') {
        hideTodoPanel();
    } else {
        showTodoPanel();
        // 타이머 패널 닫기
        if (timerPanel) {
            timerPanel.style.opacity = '0';
            timerPanel.style.pointerEvents = 'none';
            timerPanel.style.transform = 'translateY(30px)';
        }
    }
});

closeBtn.addEventListener('click', () => {
    hideTodoPanel();
});

document.addEventListener('click', (e) => {
    if (todoPanel.contains(e.target) || e.target === todoButton) {
        return;
    }
    hideTodoPanel();
});

// Add Todo Item
function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${todoText}</span>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        `;
        
        // Add delete functionality
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            li.remove();
        });

        todoList.appendChild(li);
        todoInput.value = '';
    }
}

addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Music Player Functionality
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progress = document.querySelector('.progress');
const songTitle = document.getElementById('songTitle');

let isPlaying = false;
let currentSong = 0;

// Playlist with actual songs from assets folder
const playlist = [
    { title: "City Lights", url: "assets/musics/3-city lights.mp3" },
    { title: "Retro City", url: "assets/musics/4-retro city.mp3" },
    { title: "And So It Begins", url: "assets/musics/5-and so it begins.mp3" },
    { title: "Purple", url: "assets/musics/6-purple.mp3" },
    { title: "Gameplay", url: "assets/musics/8-gameplay.mp3" },
    { title: "On The Top", url: "assets/musics/10-on the top.mp3" },
    { title: "Tomato Farm", url: "assets/musics/11-tomato farm.mp3" },
];

// Create audio element
const audio = new Audio();

// Update progress bar
audio.addEventListener('timeupdate', () => {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${progressPercent}%`;
});

// When song ends, play next song
audio.addEventListener('ended', () => {
    currentSong = (currentSong + 1) % playlist.length;
    loadSong(currentSong);
    audio.play(); // 무조건 play
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
});

// Play/Pause functionality
playBtn.addEventListener('click', () => {
    if (isCustomYoutube) {
        if (youtubeIframe) {
            // 유튜브는 iframe src를 다시 설정해서 재생/일시정지 구현 가능(간단화)
            if (isPlaying) {
                youtubeIframe.src += '';
            } else {
                youtubeIframe.src += '';
            }
        }
        isPlaying = !isPlaying;
        playBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
        return;
    }
    if (isPlaying) {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
});

// Previous song
prevBtn.addEventListener('click', () => {
    stopYoutubeIfPlaying();
    currentSong = (currentSong - 1 + playlist.length) % playlist.length;
    loadSong(currentSong);
    if (isPlaying) {
        audio.play();
    }
});

// Next song
nextBtn.addEventListener('click', () => {
    stopYoutubeIfPlaying();
    currentSong = (currentSong + 1) % playlist.length;
    loadSong(currentSong);
    if (isPlaying) {
        audio.play();
    }
});

// Load song
function loadSong(index) {
    audio.src = playlist[index].url;
    songTitle.textContent = playlist[index].title;
    if (isPlaying) {
        audio.play();
    }
}

// Initialize with first song
loadSong(currentSong);

// --- Pomodoro Timer FAB & Panel (독립 동작) ---
const openTimerBtn = document.getElementById('open-timer-btn');
const timerPanel = document.getElementById('timer-panel');
const timerMainDisplay = document.getElementById('timerMainDisplay');
const timerControls = document.getElementById('timerControls');

function showTimerPanel() {
    timerPanel.style.opacity = '1';
    timerPanel.style.pointerEvents = 'all';
    timerPanel.style.transform = 'translateY(0)';
}

function hideTimerPanel() {
    timerPanel.style.opacity = '0';
    timerPanel.style.pointerEvents = 'none';
    timerPanel.style.transform = 'translateY(30px)';
}

if (openTimerBtn && timerPanel) {
    openTimerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (timerPanel.style.opacity === '1') {
            hideTimerPanel();
        } else {
            showTimerPanel();
            // todo 패널 닫기
            if (todoPanel) {
                todoPanel.style.opacity = '0';
                todoPanel.style.pointerEvents = 'none';
                todoPanel.style.transform = 'translateY(30px)';
            }
        }
    });

    document.addEventListener('click', (e) => {
        // 패널 내부 클릭, 타이머 버튼, 설정 버튼, 설정창 클릭은 무시
        if (
            timerPanel.contains(e.target) ||
            e.target === openTimerBtn ||
            (timerSettings && (timerSettings.contains(e.target) || e.target === settingsBtn))
        ) {
            return;
        }
        hideTimerPanel();
    });
}

// Prevent timer panel from closing when clicking any button inside it
if (timerPanel) {
    timerPanel.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
        });
    });
}

// --- Pomodoro Timer Logic ---
const startTimerBtn = document.getElementById('startTimer');
const resetTimerBtn = document.getElementById('resetTimer');
const settingsBtn = document.getElementById('timer-settings-btn');
const timerSettings = document.querySelector('.timer-settings');
const saveSettingsBtn = document.getElementById('saveSettings');
const workTimeInput = document.getElementById('workTime');
const breakTimeInput = document.getElementById('breakTime');
const repeatCountInput = document.getElementById('repeatCount');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const currentRoundSpan = document.getElementById('currentRound');
const totalRoundsSpan = document.getElementById('totalRounds');
const timerProgress = document.getElementById('timerProgress');

let timeLeft = 25 * 60;
let timerId = null;
let isWorkTime = true;
let workTime = 25;
let breakTime = 5;
let repeatCount = 4;
let currentRound = 1;
const CIRCLE_LENGTH = 2 * Math.PI * 74;

if (settingsBtn && timerSettings) {
    settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        timerSettings.classList.toggle('active');
        if (timerSettings.classList.contains('active')) {
            if (timerMainDisplay) timerMainDisplay.style.display = 'none';
            if (timerControls) timerControls.style.display = 'none';
        } else {
            if (timerMainDisplay) timerMainDisplay.style.display = '';
            if (timerControls) timerControls.style.display = '';
        }
    });
}

if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', () => {
        workTime = parseInt(workTimeInput.value);
        breakTime = parseInt(breakTimeInput.value);
        repeatCount = parseInt(repeatCountInput.value);
        totalRoundsSpan.textContent = repeatCount;
        resetTimer();
        timerSettings.classList.remove('active');
        if (timerMainDisplay) timerMainDisplay.style.display = '';
        if (timerControls) timerControls.style.display = '';
    });
}

if (startTimerBtn) {
    startTimerBtn.addEventListener('click', () => {
        if (timerId === null) {
            startTimer();
            startTimerBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            pauseTimer();
            startTimerBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
}

if (resetTimerBtn) {
    resetTimerBtn.addEventListener('click', () => {
        resetTimer();
        startTimerBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
}

function startTimer() {
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        updateCircle();
        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            if (!isWorkTime) {
                currentRound++;
                currentRoundSpan.textContent = currentRound;
            }
            if (currentRound > repeatCount) {
                startTimerBtn.innerHTML = '<i class="fas fa-play"></i>';
                // Play notification sound
                const audio = new Audio('assets/musics/ding.mp3');
                audio.play();
                return;
            }
            isWorkTime = !isWorkTime;
            timeLeft = (isWorkTime ? workTime : breakTime) * 60;
            updateDisplay();
            updateCircle();
            startTimerBtn.innerHTML = '<i class="fas fa-play"></i>';
            // Play notification sound
            const audio = new Audio('assets/musics/ding.mp3');
            audio.play();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = workTime * 60;
    currentRound = 1;
    currentRoundSpan.textContent = currentRound;
    totalRoundsSpan.textContent = repeatCount;
    updateDisplay();
    updateCircle();
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    updateCircle();
}

function updateCircle() {
    let total = (isWorkTime ? workTime : breakTime) * 60;
    let percent = timeLeft / total;
    if (timerProgress) {
        timerProgress.setAttribute('stroke-dasharray', CIRCLE_LENGTH);
        timerProgress.setAttribute('stroke-dashoffset', CIRCLE_LENGTH * (1 - percent));
    } else {
        console.warn('timerProgress SVG element not found!');
    }
}

// 초기화
resetTimer();

// Item Selection Panel Logic
const itemImages = {
  hair: Array.from({length: 12}, (_, i) => `assets/images/hair/Hair${i+1}.png`),
  eyes: Array.from({length: 12}, (_, i) => `assets/images/eye/eye${i+1}.gif`),
  skin: Array.from({length: 6}, (_, i) => `assets/images/body/Skin${i+1}.gif`),
  clothes: Array.from({length: 12}, (_, i) => `assets/images/clothing/Clothing${i+1}.png`)
};
const itemTitles = {
  hair: '헤어 선택',
  eyes: '눈 선택',
  skin: '피부 선택',
  clothes: '의상 선택'
};
const itemBgClass = {
  hair: '.bg-hair',
  eyes: '.bg-eye',
  skin: '.bg-body',
  clothes: '.bg-clothes'
};

const itemPanel = document.getElementById('itemPanel');
const itemTabs = itemPanel.querySelectorAll('.item-tab');
const itemPanelTitle = document.getElementById('itemPanelTitle');
const itemGrid = itemPanel.querySelector('.hair-grid');

// 탭 클릭 시
itemTabs.forEach(tab => {
  tab.onclick = function() {
    itemTabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    const type = this.dataset.type;
    renderPalette(type);
    colorPalette.querySelectorAll('.color-circle').forEach(c => c.classList.remove('selected'));
    selectedColorIdx = null;
    renderItemGrid(type);
  };
});

// 아이템 그리드 렌더링
function renderItemGrid(type) {
  itemGrid.innerHTML = itemImages[type].map((src, idx) => `
    <div class="hair-item" data-type="${type}" data-img="${src}">
      <img src="${src}" alt="${type}${idx+1}">
    </div>
  `).join('');
  // 클릭 이벤트
  itemGrid.querySelectorAll('.hair-item').forEach(item => {
    item.onclick = function() {
      itemGrid.querySelectorAll('.hair-item').forEach(i => i.classList.remove('selected'));
      this.classList.add('selected');
      const target = document.querySelector(itemBgClass[type]);
      if(target) target.style.backgroundImage = `url('${this.dataset.img}')`;
    };
  });
}

// 사이드 메뉴 패널 닫기 함수
function closeAllSidePanels() {
  // 아이템(드레스업) 패널
  if (itemPanel) itemPanel.style.display = 'none';
  // object/desk 패널
  if (objectDeskPanel) objectDeskPanel.style.display = 'none';
  // weather 패널
  if (weatherPanel) weatherPanel.style.display = 'none';
  // gallery 패널
  if (galleryPanel) galleryPanel.style.display = 'none';
}

// 드레스업(첫번째) 아이콘
const openItemPanelBtn = document.querySelector('.todo-button.side-menu-btn');
openItemPanelBtn.onclick = () => {
  closeAllSidePanels();
  itemPanel.style.display = 'flex';
  itemTabs.forEach(t => t.classList.remove('active'));
  itemTabs[0].classList.add('active');
  renderPalette('hair');
  selectedColorIdx = null;
  renderItemGrid('hair');
};
document.querySelector('.close-hair-panel').onclick = () => {
  itemPanel.style.display = 'none';
};

// 팔레트(아이콘)용 색상
const colorOptions = [
  {name: 'red',    h: 0,   s: 100, l: 50},
  {name: 'orange', h: 30,  s: 100, l: 50}, // 보기 좋은 주황
  {name: 'yellow', h: 50,  s: 100, l: 50},
  {name: 'green',  h: 100, s: 100, l: 45},
  {name: 'blue',   h: 190, s: 100, l: 55},
  {name: 'purple', h: 290, s: 80,  l: 60},
  {name: 'pink',   h: 320, s: 100, l: 65},
  {name: 'gray',   h: 0,   s: 0,   l: 60},
  {name: 'black',  h: 0,   s: 0,   l: 10}
];
// 실제 필터 적용용 색상
const colorFilterOptions = [
  {h: 0,   s: 100, l: 50},    // 빨강
  {h: 18,  s: 180, l: 50},   // 주황
  {h: 40,  s: 100, l: 50},   // 노랑
  {h: 100, s: 100, l: 45},
  {h: 190, s: 100, l: 55},
  {h: 275, s: 160, l: 38},    // 진한 보라
  {h: 320, s: 100, l: 65},
  {h: 50,  s: 0,   l: 65},    // 밝은 회색
  {h: 50,   s: 0,   l: 20}
];

// 팔레트 렌더링 (카테고리별로 검정색 버튼 제외)
function renderPalette(type = 'hair') {
  if (type === 'skin') {
    colorPalette.style.display = 'none';
    return;
  } else {
    colorPalette.style.display = 'flex';
  }
  let palette = colorOptions;
  if (type === 'eyes') {
    palette = colorOptions.slice(0, colorOptions.length - 1); // 마지막(검정) 제외
  }
  colorPalette.innerHTML = palette.map((c, i) =>
    `<div class="color-circle" data-idx="${i}" style="background:hsl(${c.h},${c.s}%,${c.l}%);"></div>`
  ).join('');
}

// 현재 선택된 색상 인덱스
let selectedColorIdx = null;

// 팔레트 클릭 이벤트
colorPalette.onclick = function(e) {
  const circle = e.target.closest('.color-circle');
  if (!circle) return;
  colorPalette.querySelectorAll('.color-circle').forEach(c => c.classList.remove('selected'));
  circle.classList.add('selected');
  selectedColorIdx = +circle.dataset.idx;
  applyColorToCurrentItem();
};

const baseHue = 50; // 노랑

function applyColorToCurrentItem() {
  if (selectedColorIdx === null) return;
  const activeTab = document.querySelector('.item-tab.active');
  if (!activeTab) return;
  const type = activeTab.dataset.type;
  const target = document.querySelector(itemBgClass[type]);
  if (!target) return;
  const {h, s, l} = colorFilterOptions[selectedColorIdx];
  let hueRotate = h - baseHue;
  let saturate = s / 100;
  if (h === 0) { // 빨강
    hueRotate -= 15;
    saturate = 2.5;
  }
  target.style.filter = `hue-rotate(${hueRotate}deg) saturate(${saturate}) brightness(${l/50})`;
}

// 탭 전환 시 팔레트 초기화
itemTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    colorPalette.querySelectorAll('.color-circle').forEach(c => c.classList.remove('selected'));
    selectedColorIdx = null;
    // 필터 초기화
    const type = tab.dataset.type;
    const target = document.querySelector(itemBgClass[type]);
    if (target) target.style.filter = '';
  });
});

// Weather Panel Logic
const weatherPanel = document.getElementById('weatherPanel');
const weatherPanelTabs = weatherPanel.querySelectorAll('.weather-tab');
const weatherPanelContent = weatherPanel.querySelector('.weather-panel-content');
const closeWeatherPanel = weatherPanel.querySelector('.close-weather-panel');
const weatherBtn = document.querySelectorAll('.side-menu-btn')[2]; // ☁️ 아이콘

const timeOptions = ['morning', 'noon', 'afternoon', 'evening', 'night', 'dawn'];
const weatherOptions = ['sunny', 'rainy', 'snowy', 'windy'];

const overlayIds = {
  morning: 'time-overlay-morning',
  noon: 'time-overlay-noon',
  afternoon: 'time-overlay-afternoon',
  evening: 'time-overlay-evening',
  night: 'time-overlay-night',
  dawn: 'time-overlay-dawn'
};

const rainEffect = document.getElementById('rain-effect');
let rainAudio = null;

function showRainEffect() {
  rainEffect.innerHTML = '';
  for (let i = 0; i < 60; i++) {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';
    drop.style.left = Math.random() * 100 + 'vw';
    drop.style.animationDelay = (Math.random() * 1.2) + 's';
    drop.style.height = (40 + Math.random() * 40) + 'px';
    rainEffect.appendChild(drop);
  }
  rainEffect.classList.add('active');
  // rain sound
  if (!rainAudio) {
    rainAudio = new Audio('assets/musics/rain.mp3');
    rainAudio.loop = true;
    rainAudio.volume = 0.6;
  }
  rainAudio.volume = 0.6;
  rainAudio.currentTime = 0;
  rainAudio.play();
}
function hideRainEffect() {
  rainEffect.classList.remove('active');
  rainEffect.innerHTML = '';
  if (rainAudio) {
    rainAudio.pause();
    rainAudio.currentTime = 0;
  }
}

const snowEffect = document.getElementById('snow-effect');
let snowAudio = null;

function showSnowEffect() {
  snowEffect.innerHTML = '';
  for (let i = 0; i < 50; i++) {
    const flake = document.createElement('div');
    flake.className = 'snow-flake';
    flake.style.left = Math.random() * 100 + 'vw';
    flake.style.animationDelay = (Math.random() * 4) + 's';
    flake.style.width = flake.style.height = (6 + Math.random() * 8) + 'px';
    snowEffect.appendChild(flake);
  }
  snowEffect.classList.add('active');
}
function hideSnowEffect() {
  snowEffect.classList.remove('active');
  snowEffect.innerHTML = '';
  if (snowAudio) {
    snowAudio.pause();
    snowAudio.currentTime = 0;
  }
}

const leafEffect = document.getElementById('leaf-effect');
let leafInterval = null;

function showLeafEffect() {
  leafEffect.innerHTML = '';
  const leafImgs = [
    'assets/images/others/leaf1.png',
    'assets/images/others/leaf2.png',
    'assets/images/others/leaf3.png'
  ];
  for (let i = 0; i < 12; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.style.left = Math.random() * 100 + 'vw';
    const dir = Math.random() > 0.5 ? 'left' : 'right';
    leaf.style.animation = `leaf-fall-${dir} ${6 + Math.random() * 6}s linear infinite`;
    leaf.style.opacity = 0.5 + Math.random() * 0.5;
    leaf.style.transform = `rotate(${Math.random()*360}deg) scale(${0.7+Math.random()*0.6})`;
    const img = document.createElement('img');
    img.src = leafImgs[Math.floor(Math.random()*leafImgs.length)];
    img.style.width = '22px';
    img.style.height = '22px';
    img.style.opacity = '0.85';
    img.style.pointerEvents = 'none';
    leaf.appendChild(img);
    leafEffect.appendChild(leaf);
  }
  leafEffect.classList.add('active');
}
function hideLeafEffect() {
  leafEffect.classList.remove('active');
  leafEffect.innerHTML = '';
}

let windAudio = null;

function setTimeOverlay(type, value) {
  if (type === 'time') {
    // 시간 오버레이만 제어
    Object.values(overlayIds).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('active');
    });
    if (overlayIds[value]) {
      const el = document.getElementById(overlayIds[value]);
      if (el) el.classList.add('active');
    }
  } else if (type === 'weather') {
    // 날씨 효과만 제어
    if (value === 'sunny') {
      hideRainEffect();
      hideSnowEffect();
      hideLeafEffect();
      if (windAudio) { windAudio.pause(); windAudio.currentTime = 0; }
    } else if (value === 'rainy') {
      showRainEffect();
      hideSnowEffect();
      hideLeafEffect();
      if (windAudio) { windAudio.pause(); windAudio.currentTime = 0; }
    } else if (value === 'snowy') {
      hideRainEffect();
      showSnowEffect();
      hideLeafEffect();
      if (windAudio) { windAudio.pause(); windAudio.currentTime = 0; }
    } else if (value === 'windy') {
      hideRainEffect();
      hideSnowEffect();
      showLeafEffect();
    }
  }
}

function hideAllTimeOverlays() {
  Object.values(overlayIds).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
}

function renderWeatherPanel(type = 'time') {
  let options = type === 'time' ? timeOptions : weatherOptions;
  weatherPanelContent.innerHTML = options.map(opt =>
    `<button class="weather-btn" data-value="${opt}">${opt}</button>`
  ).join('');

  // 선택 효과
  weatherPanelContent.querySelectorAll('.weather-btn').forEach(btn => {
    btn.onclick = function() {
      // 같은 탭 내의 버튼들만 선택 해제
      const currentTab = this.closest('.weather-panel-content').querySelectorAll('.weather-btn');
      currentTab.forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
      
      // 오버레이 제어
      const tabType = document.querySelector('.weather-tab.active').dataset.type;
      setTimeOverlay(tabType, this.dataset.value);
    };
  });
}

// 탭 클릭 시 해당 탭의 선택 상태 유지
weatherPanelTabs.forEach(tab => {
  tab.onclick = function() {
    weatherPanelTabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    renderWeatherPanel(this.dataset.type);
    
    // 이전에 선택된 버튼들의 상태 복원
    const type = this.dataset.type;
    const selectedButtons = weatherPanel.querySelectorAll('.weather-btn.selected');
    selectedButtons.forEach(btn => {
      if (btn.parentElement === weatherPanelContent) {
        setTimeOverlay(type, btn.dataset.value);
      }
    });
  };
});

// 패널 열기/닫기
weatherBtn.onclick = () => {
  closeAllSidePanels();
  weatherPanel.style.display = 'flex';
  weatherPanelTabs.forEach(t => t.classList.remove('active'));
  weatherPanelTabs[0].classList.add('active');
  renderWeatherPanel('time');
};
closeWeatherPanel.onclick = () => {
  weatherPanel.style.display = 'none';
};

// Gallery Panel Logic
const galleryPanel = document.getElementById('galleryPanel');
const galleryPanelHeader = galleryPanel.querySelector('.gallery-panel-header');
const closeGalleryPanel = galleryPanel.querySelector('.close-gallery-panel');
const galleryGrid = galleryPanel.querySelector('.gallery-grid');
const treeBtn = document.querySelectorAll('.side-menu-btn')[3]; // 🌳 아이콘

// 24개 아이템 
const galleryItems = [
  "https://wallpapershome.com/images/pages/pic_h/27008.jpg",
  "https://wallpapershome.com/images/pages/pic_h/16241.jpg",
  "https://wallpapershome.com/images/pages/pic_h/387.jpg",
  "https://wallpapershome.com/images/pages/pic_h/181.jpg",
  "https://wallpapershome.com/images/pages/pic_h/179.jpg",
  "https://wallpapershome.com/images/pages/pic_h/26309.jpg",
  "https://wallpapershome.com/images/pages/pic_h/658.jpg",
  "https://wallpapershome.com/images/pages/pic_h/5278.jpg",
  "https://wallpapershome.com/images/pages/pic_h/156.jpg",
  "https://images.pexels.com/photos/15522610/pexels-photo-15522610.jpeg",
  "https://wallpapershome.com/images/pages/pic_h/26734.jpg",
  "https://images.pexels.com/photos/547125/pexels-photo-547125.jpeg",
  "https://images.pexels.com/photos/9899126/pexels-photo-9899126.jpeg",
  "https://images.pexels.com/photos/383640/pexels-photo-383640.jpeg",
  "https://wallpapershome.com/images/pages/pic_h/26338.jpg",
  "https://wallpapershome.com/images/pages/pic_h/26916.jpg",
  "https://wallpapershome.com/images/pages/pic_h/5514.jpg",
  "https://wallpapershome.com/images/pages/pic_h/25987.jpg",
  "https://wallpapershome.com/images/pages/pic_h/8972.jpg",
  "https://wallpapershome.com/images/pages/pic_h/5520.jpg",
  "https://wallpapershome.com/images/pages/pic_h/5333.jpg",
  "https://wallpapershome.com/images/pages/pic_h/5540.jpg",
  "https://images.pexels.com/photos/691668/pexels-photo-691668.jpeg",
  "https://wallpapershome.com/images/pages/pic_h/5401.jpg"
];

function renderGalleryGrid() {
  galleryGrid.innerHTML = galleryItems.map((src, idx) =>
    `<div class="gallery-item" data-idx="${idx}">
       <img src="${src}" alt="item${idx+1}" style="max-width:70px;max-height:70px;object-fit:contain;">
     </div>`
  ).join('');
  galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
    item.onclick = function() {
      galleryGrid.querySelectorAll('.gallery-item').forEach(i => i.classList.remove('selected'));
      this.classList.add('selected');
      // 실제 이미지 선택 시 .bg-window의 src를 교체
      const idx = this.dataset.idx;
      const bgWindow = document.querySelector('.bg-window');
      if (bgWindow) {
        bgWindow.src = galleryItems[idx];
      }
    };
  });
}

treeBtn.onclick = () => {
  closeAllSidePanels();
  galleryPanel.style.display = 'flex';
  renderGalleryGrid();
};
closeGalleryPanel.onclick = () => {
  galleryPanel.style.display = 'none';
};

// --- Object/Desk Item Selection Panel ---
const objectDeskPanel = document.getElementById('objectDeskPanel');
const objectDeskTabs = objectDeskPanel.querySelectorAll('.object-desk-tab');
const objectDeskPanelTitle = document.getElementById('objectDeskPanelTitle');
const objectDeskGrid = objectDeskPanel.querySelector('.object-desk-grid');
const closeObjectDeskPanel = objectDeskPanel.querySelector('.close-object-desk-panel');
const objectBtn = document.querySelectorAll('.side-menu-btn')[1]; // 두번째(책) 아이콘

const objectImages = Array.from({length: 7}, (_, i) => `assets/images/object/object${i+1}.png`);
const deskImages = [1,2,3].map(i => `assets/images/others/table${i}.png`);
const objectDeskTitles = { object: '오브젝트 선택', desk: '책상 선택' };
const objectDeskBgClass = { object: '.bg-object', desk: '.bg-desk' };

const objectDeskColorPalette = document.getElementById('objectDeskColorPalette');
const objectDeskColors = [
  {name: 'red',    h: 0,   s: 100, l: 50},
  {name: 'yellow', h: 50,  s: 100, l: 50},
  {name: 'blue',   h: 210, s: 100, l: 50},
  {name: 'pink',   h: 320, s: 100, l: 75},
  {name: 'white',  h: 0,   s: 0,   l: 100},
  {name: 'black',  h: 0,   s: 0,   l: 10}
];
let objectDeskSelectedColorIdx = null;
let objectDeskCurrentType = 'object';

function renderObjectDeskColorPalette(type = objectDeskCurrentType) {
  if (type === 'object') {
    objectDeskColorPalette.style.display = 'none';
  } else {
    objectDeskColorPalette.style.display = 'flex';
    objectDeskColorPalette.innerHTML = objectDeskColors.map((c, i) =>
      `<div class="color-circle" data-idx="${i}" style="background:hsl(${c.h},${c.s}%,${c.l}%);"></div>`
    ).join('');
  }
}

objectDeskColorPalette.onclick = function(e) {
  if (objectDeskCurrentType !== 'desk') return;
  const circle = e.target.closest('.color-circle');
  if (!circle) return;
  objectDeskColorPalette.querySelectorAll('.color-circle').forEach(c => c.classList.remove('selected'));
  circle.classList.add('selected');
  objectDeskSelectedColorIdx = +circle.dataset.idx;
  applyObjectDeskColorToCurrent();
};

function applyObjectDeskColorToCurrent() {
  if (objectDeskCurrentType !== 'desk' || objectDeskSelectedColorIdx === null) return;
  const type = objectDeskCurrentType;
  const target = document.querySelector(objectDeskBgClass[type]);
  if (!target) return;
  const {h, s, l} = objectDeskColors[objectDeskSelectedColorIdx];
  let filter = '';
  if (objectDeskColors[objectDeskSelectedColorIdx].name === 'white') {
    filter = 'brightness(2) grayscale(0.1)';
  } else if (objectDeskColors[objectDeskSelectedColorIdx].name === 'black') {
    filter = 'brightness(0.4) grayscale(1)';
  } else {
    filter = `hue-rotate(${h}deg) saturate(${s/100}) brightness(${l/50})`;
  }
  target.style.filter = filter;
}

function renderObjectDeskGrid(type) {
  objectDeskCurrentType = type;
  renderObjectDeskColorPalette(type);
  const images = type === 'object' ? objectImages : deskImages;
  objectDeskGrid.innerHTML = images.map((src, idx) => `
    <div class="object-desk-item" data-type="${type}" data-img="${src}">
      <img src="${src}" alt="${type}${idx+1}">
    </div>
  `).join('');
  objectDeskGrid.querySelectorAll('.object-desk-item').forEach(item => {
    item.onclick = function() {
      objectDeskGrid.querySelectorAll('.object-desk-item').forEach(i => i.classList.remove('selected'));
      this.classList.add('selected');
      const target = document.querySelector(objectDeskBgClass[type]);
      if(target) target.style.backgroundImage = `url('${this.dataset.img}')`;
      if(type === 'desk') applyObjectDeskColorToCurrent();
      else if(target) target.style.filter = '';
    };
  });
}

objectBtn.onclick = () => {
  closeAllSidePanels();
  objectDeskPanel.style.display = 'flex';
  objectDeskTabs.forEach(t => t.classList.remove('active'));
  objectDeskTabs[0].classList.add('active');
  renderObjectDeskColorPalette();
  objectDeskSelectedColorIdx = null;
  renderObjectDeskGrid('object');
};
closeObjectDeskPanel.onclick = () => {
  objectDeskPanel.style.display = 'none';
};
objectDeskTabs.forEach(tab => {
  tab.onclick = function() {
    objectDeskTabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    const type = this.dataset.type;
    objectDeskSelectedColorIdx = null;
    renderObjectDeskGrid(type);
  };
});

document.addEventListener('DOMContentLoaded', function() {
  const cat = document.querySelector('.cat-interactive');
  const catBubble = document.getElementById('catBubble');
  const catMessages = [
    '무슨 일이든 지금 하고 있는 일에 몰두하도록 해.',
    '집중은 덜 중요한 다른 일을 순간적으로 잊어버리는 거야.',
    '유일한 행복은 목적을 위해 몰입할 때 와.',
    '지금 당장 할 수 있는 일에 집중하자.',
    '할 수 있는 것에 집중하고, 못 한 것을 후회하지 마.',
    '제대로 집중하면 6시간 걸릴 일을 30분만에 끝낼 수 있지만, 그 반대도 마찬가지야.',
    '하기 싫어도 일단 앉아서 5분만 해볼까?',
    '집중과 정신적 단단함이 승리의 격차를 만들지.',
    '모든 위대한 변화는 사소한 도미노부터 시작해.',
    '시작이 반이라는 말 들어봤지?'
  ];
  let catBubbleActive = false;
  if (cat) {
    cat.addEventListener('click', () => {
      if (catBubbleActive) return;
      catBubbleActive = true;
      // 말풍선
      const msg = catMessages[Math.floor(Math.random() * catMessages.length)];
      catBubble.textContent = msg;
      catBubble.classList.add('active');
      // 고양이 반응
      cat.style.setProperty('background-image', "url('./assets/images/others/cat-startled.gif')", 'important');
      cat.style.setProperty('background-position', 'center 60px', 'important');
      const meow = new Audio('./assets/musics/meow.mp3');
      meow.volume = 1.0;
      meow.currentTime = 0.9;
      meow.play();
      setTimeout(() => {
        cat.style.setProperty('background-image', "url('./assets/images/others/cat-default.gif')", 'important');
        cat.style.setProperty('background-position', 'center center', 'important');
        catBubble.classList.remove('active');
        catBubbleActive = false;
      }, 4000);
    });
  }
});

// --- Memo FAB & Panel ---
const openMemoBtn = document.getElementById('open-memo-btn');
const memoPanel = document.getElementById('memo-panel');
const memoText = document.getElementById('memoText');
const saveMemoBtn = document.getElementById('saveMemo');

function showMemoPanel() {
    memoPanel.style.opacity = '1';
    memoPanel.style.pointerEvents = 'all';
    memoPanel.style.transform = 'translateY(0)';
}

function hideMemoPanel() {
    memoPanel.style.opacity = '0';
    memoPanel.style.pointerEvents = 'none';
    memoPanel.style.transform = 'translateY(30px)';
}

if (openMemoBtn && memoPanel) {
    openMemoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (memoPanel.style.opacity === '1') {
            hideMemoPanel();
        } else {
            showMemoPanel();
            // 다른 패널들 닫기
            if (todoPanel) {
                todoPanel.style.opacity = '0';
                todoPanel.style.pointerEvents = 'none';
                todoPanel.style.transform = 'translateY(30px)';
            }
            if (timerPanel) {
                timerPanel.style.opacity = '0';
                timerPanel.style.pointerEvents = 'none';
                timerPanel.style.transform = 'translateY(30px)';
            }
        }
    });

    document.addEventListener('click', (e) => {
        if (memoPanel.contains(e.target) || e.target === openMemoBtn) {
            return;
        }
        hideMemoPanel();
    });
}

// 메모 저장 기능
if (saveMemoBtn && memoText) {
    saveMemoBtn.addEventListener('click', () => {
        const memo = memoText.value.trim();
        if (memo) {
            createStickyNote(memo);
            memoText.value = '';
            hideMemoPanel();
        }
    });
}

// 메모지 생성 및 드래그/삭제 기능
function createStickyNote(text) {
  const container = document.getElementById('sticky-notes-container');
  const note = document.createElement('div');
  note.className = 'sticky-note';
  note.innerHTML = `
    <button class="close-btn" title="닫기">&times;</button>
    <div class="note-content">${text}</div>
  `;

  // 화면 중앙에 위치시키기
  const noteWidth = 200; // CSS에서 max-width, width 고정
  const noteHeight = 150; // 대략적인 높이
  const x = window.innerWidth / 2 - noteWidth / 2;
  const y = window.innerHeight / 2 - noteHeight / 2;
  note.style.left = x + 'px';
  note.style.top = y + 'px';

  // 드래그 기능
  let offsetX, offsetY, isDragging = false;

  note.addEventListener('mousedown', function(e) {
    if (e.target.classList.contains('close-btn')) return;
    isDragging = true;
    offsetX = e.clientX - note.getBoundingClientRect().left;
    offsetY = e.clientY - note.getBoundingClientRect().top;
    note.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    note.style.left = (e.clientX - offsetX) + 'px';
    note.style.top = (e.clientY - offsetY) + 'px';
  });

  document.addEventListener('mouseup', function() {
    isDragging = false;
    note.style.cursor = 'grab';
    document.body.style.userSelect = '';
  });

  // 삭제 기능
  note.querySelector('.close-btn').addEventListener('click', function() {
    note.remove();
  });

  container.appendChild(note);
}

// Prevent memo panel from closing when clicking any button inside it
if (memoPanel) {
    memoPanel.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
        });
    });
}

// 경험치 레벨업에 필요한 시간(초) 배열 생성
function getLevelUpSeconds(level) {
  if (level === 1) return 60;
  if (level === 2) return 300;
  if (level === 3) return 600;
  if (level === 4) return 1200;
  if (level === 5) return 1800;
  if (level === 6) return 2400;
  return 2400 + (level - 6) * 600;
}

// 누적 시간(초) 저장 및 불러오기
function getAccumulatedSeconds() {
  return parseInt(localStorage.getItem('expAccumulatedSeconds') || '0', 10);
}
function setAccumulatedSeconds(sec) {
  localStorage.setItem('expAccumulatedSeconds', sec);
}

// 경험치 바 UI 업데이트
function updateExpBarUI() {
  const container = document.getElementById('exp-bar-container');
  if (!container) return;

  let seconds = getAccumulatedSeconds();
  let level = 1;
  let remain = seconds;
  let need = getLevelUpSeconds(level);

  // 이전 레벨 저장
  let prevLevel = parseInt(localStorage.getItem('expPrevLevel') || '1', 10);

  // 레벨 계산
  while (remain >= need) {
    remain -= need;
    level++;
    need = getLevelUpSeconds(level);
  }

  // 레벨업 사운드
  if (level > prevLevel) {
    const audio = new Audio('assets/musics/level-up.mp3');
    audio.play();
  }
  localStorage.setItem('expPrevLevel', level);

  // 시간 포맷
  function format(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  // UI
  container.innerHTML = `
    <div class="exp-bar-bg">
      <div class="exp-level-circle">${level}</div>
      <div class="exp-bar-info">
        <div class="exp-bar-time">누적 ${format(seconds)}</div>
        <div class="exp-bar-bar">
          <div class="exp-bar-fill" style="width:${Math.floor((remain/need)*100)}%"></div>
        </div>
      </div>
    </div>
    <div class="exp-bar-next">다음 레벨까지 ${format(need-remain)}...</div>
  `;
}

// 1초마다 누적 시간 증가 및 UI 갱신
function startExpBarTimer() {
  setInterval(() => {
    let acc = getAccumulatedSeconds();
    acc++;
    setAccumulatedSeconds(acc);
    updateExpBarUI();
  }, 1000);
}

// 페이지 로드시 경험치 바 생성 및 타이머 시작
window.addEventListener('DOMContentLoaded', () => {
  // 새로고침 시 경험치와 레벨 리셋
  localStorage.removeItem('expAccumulatedSeconds');
  localStorage.removeItem('expPrevLevel');
  updateExpBarUI();
  startExpBarTimer();
});

// 유튜브 커스텀 곡 재생 기능
const youtubeUrlInput = document.getElementById('youtubeUrlInput');
const addYoutubeBtn = document.getElementById('addYoutubeBtn');
let isCustomYoutube = false;
let youtubeIframe = null;

function extractYoutubeId(url) {
    // 다양한 유튜브 URL에서 ID 추출
    const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[1].length === 11) ? match[1] : null;
}

if (addYoutubeBtn && youtubeUrlInput) {
    addYoutubeBtn.addEventListener('click', () => {
        const url = youtubeUrlInput.value.trim();
        const videoId = extractYoutubeId(url);
        if (videoId) {
            // 기존 오디오 멈춤
            audio.pause();
            isPlaying = false;
            // 기존 iframe 제거
            if (youtubeIframe) youtubeIframe.remove();
            // iframe 생성
            youtubeIframe = document.createElement('iframe');
            youtubeIframe.width = '0';
            youtubeIframe.height = '0';
            youtubeIframe.style.display = 'none';
            youtubeIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            youtubeIframe.allow = 'autoplay';
            document.body.appendChild(youtubeIframe);
            // 곡 제목 변경
            songTitle.textContent = 'custom song';
            isCustomYoutube = true;
        } else {
            alert('유효한 유튜브 링크가 아닙니다.');
        }
    });
}

// 기존 오디오 재생 시 유튜브 중지
function stopYoutubeIfPlaying() {
    if (isCustomYoutube && youtubeIframe) {
        youtubeIframe.remove();
        youtubeIframe = null;
        isCustomYoutube = false;
    }
}

// --- Meditation FAB & Panel ---
const openMeditationBtn = document.getElementById('open-meditation-btn');
const meditationPanel = document.getElementById('meditation-panel');
const meditationCircle = document.getElementById('meditation-circle');
const meditationText = document.getElementById('meditation-text');
const closeMeditationBtn = document.getElementById('close-meditation-btn');

let meditationInterval = null;
let meditationStep = 0;
const meditationSteps = [
  { text: '들이마시기', duration: 4000, circle: 180 },
  { text: '참기', duration: 2000, circle: 180 },
  { text: '내쉬기', duration: 4000, circle: 120 },
  { text: '참기', duration: 2000, circle: 120 }
];
let meditationCount = 0;
const meditationTotalRounds = 7; // 4-2-4-2 x 7 = 1분

function showMeditationPanel() {
  meditationPanel.style.display = 'flex';
  meditationStep = 0;
  meditationCount = 0;
  meditationText.innerHTML = '움직임을 멈추고<br>호흡에 집중하십시오.';
  meditationCircle.style.width = '120px';
  meditationCircle.style.height = '120px';
  setTimeout(() => startMeditation(), 1200);
  // 다른 패널 닫기
  if (todoPanel) hideTodoPanel();
  if (timerPanel) hideTimerPanel();
  if (memoPanel) hideMemoPanel();
}

function hideMeditationPanel() {
  meditationPanel.style.display = 'none';
  stopMeditation();
}

function startMeditation() {
  meditationStep = 0;
  meditationCount = 0;
  nextMeditationStep();
}

function stopMeditation() {
  clearTimeout(meditationInterval);
  meditationText.innerHTML = '움직임을 멈추고<br>호흡에 집중하십시오.';
  meditationCircle.style.width = '120px';
  meditationCircle.style.height = '120px';
}

function nextMeditationStep() {
  const step = meditationSteps[meditationStep];
  meditationText.textContent = step.text;
  meditationCircle.style.transition = `width ${step.duration/1000}s, height ${step.duration/1000}s`;
  meditationCircle.style.width = step.circle + 'px';
  meditationCircle.style.height = step.circle + 'px';
  meditationInterval = setTimeout(() => {
    meditationStep = (meditationStep + 1) % meditationSteps.length;
    if (meditationStep === 0) meditationCount++;
    if (meditationCount >= meditationTotalRounds) {
      meditationText.textContent = '수고하셨습니다!';
      meditationCircle.style.width = '120px';
      meditationCircle.style.height = '120px';
      return;
    }
    nextMeditationStep();
  }, step.duration);
}

if (openMeditationBtn && meditationPanel) {
  openMeditationBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (meditationPanel.style.display === 'flex') {
      hideMeditationPanel();
    } else {
      showMeditationPanel();
    }
  });
  closeMeditationBtn.addEventListener('click', hideMeditationPanel);
  document.addEventListener('keydown', (e) => {
    if (meditationPanel.style.display === 'flex' && e.key === 'Escape') {
      hideMeditationPanel();
    }
  });
  document.addEventListener('click', (e) => {
    if (meditationPanel.style.display === 'flex' && !meditationPanel.contains(e.target) && e.target !== openMeditationBtn) {
      hideMeditationPanel();
    }
  });
  // 패널 내부 버튼 클릭 시 닫힘 방지
  meditationPanel.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
    });
  });
}

