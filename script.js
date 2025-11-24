// LISTE COMPLETE AVEC LES NOUVEAUX PERSONNAGES
const characterNames = [
    'mario', 'luigi', 'peach', 'bowser', 'yoshi',
    'star', 'toad', 'wario', 'waluigi', 'dk',
    'koopa', 'goomba', 'fireflower', 'ghost', 'bullet',
    'bowserjr', 'diddyk', 'daisy', 'birdo', 'harmony',
    'ninji', 'toadette', 'blooper', 'hammerbro', 'kamek',
    'koopakid', 'monty', 'pauline', 'pompom', 'shyguy',
    'skelerex', 'spike', 'bobomb', 'iceflower', '1up',
    'chainchomp', 'lightning', 'poison', 'cherry'
];
const allCharacters = characterNames.map(name => ({ name: name, img: `images/${name}.png` }));

const gameBoard = document.getElementById('gameBoard');
const timerDisplay = document.getElementById('timer');
const livesDisplay = document.getElementById('lives');
const scoreDisplay = document.getElementById('score');
const multiplierDisplay = document.getElementById('multiplierDisplay');
const bestScoreDisplay = document.getElementById('bestScore');
const loseTitle = document.getElementById('loseTitle');
const loseText = document.getElementById('loseText');
const bonusIndicator = document.getElementById('timeBonusIndicator');
const lifeBonusIndicator = document.getElementById('lifeBonusIndicator');
const startMenu = document.getElementById('startMenu');
const customMenu = document.getElementById('customMenu');
const selectionMenu = document.getElementById('selectionMenu');
const skinMenu = document.getElementById('skinMenu');
const albumMenu = document.getElementById('albumMenu');
const pauseMenu = document.getElementById('pauseMenu');
const countdownOverlay = document.getElementById('countdownOverlay');
const countdownText = document.getElementById('countdownText');
const bowserMsg = document.getElementById('bowserMsg');
const detailBase = document.getElementById('detailBase');
const detailTime = document.getElementById('detailTime');
const detailLife = document.getElementById('detailLife');

const bgMusic = document.getElementById('bgMusic');
const sfxPause = document.getElementById('sfxPause');
const sfxGameOver = document.getElementById('sfxGameOver');
const sfxWin = document.getElementById('sfxWin');
const sfxBowser = document.getElementById('sfxBowser');
const sfx1up = document.getElementById('sfx1up');
const sfxStar = document.getElementById('sfxStar');
const sfxFireball = document.getElementById('sfxFireball');
const sfxBoo = document.getElementById('sfxBoo');
const sfxFlip = document.getElementById('sfxFlip');
const sfxStart = document.getElementById('sfxStart');
const sfxSplat = document.getElementById('sfxSplat');
const sfxKamek = document.getElementById('sfxKamek');
const sfxExplosion = document.getElementById('sfxExplosion');
const sfxShyGuy = document.getElementById('sfxShyGuy');
const sfxSwish = document.getElementById('sfxSwish');

const volumeSlider = document.getElementById('volumeSlider');
const muteBtn = document.getElementById('muteBtn');
const themeBtn = document.getElementById('themeBtn');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchCount = 0;
let totalPairs = 0;
let timeLeft = 0;
let lives = 0;
let timerInterval;
let score = 0;
let scoreBase = 0;
let scoreTimeBonus = 0;
let scoreLifeBonus = 0;
let currentLevelKey = 'easy';
let isPaused = false;
let lastVolume = 0.3;
let comboCount = 0;
let scoreMultiplier = 1;
let isGameOver = false;

let isBowserActive = false;
let ghostMode = 0;
let blooperMode = 0;
let isIceActive = false;
let isChompActive = false;
let isTinyMode = false;
let isPoisonActive = false;
// VARIABLES CORRIGEES POUR SHYGUY
let isShyGuyActive = false;
let shyguyHandler = null;
let shyguyTimeout = null; // Nouveau : pour stocker le Timer

let isCherryActive = false;
let cherryHandler = null;
let magicClickHandler = null;
let cherryInterval = null;
const CHERRY_OFFSET_X = 125;
const CHERRY_OFFSET_Y = 50;

// --- DESCRIPTIONS DES POUVOIRS ---
const descriptions = {
    'star': { text: "BONUS : Révèle toutes les cartes !", type: "bonus" },
    'fireflower': { text: "BONUS : Trouve une paire automatiquement !", type: "bonus" },
    '1up': { text: "BONUS : Donne une vie supplémentaire !", type: "bonus" },

    'bowser': { text: "PIÈGE : Mélange les cartes restantes !", type: "malus" },
    'ghost': { text: "PIÈGE : Rend l'écran flou (Boo) !", type: "malus" },
    'blooper': { text: "PIÈGE : Tache l'écran d'encre !", type: "malus" },
    'kamek': { text: "PIÈGE : Échange la place de cartes !", type: "malus" },
    'bobomb': { text: "PIÈGE : Explose et retire 1 vie !", type: "malus" },
    'iceflower': { text: "PIÈGE : Gèle l'écran !", type: "malus" },
    'chainchomp': { text: "PIÈGE : Enchaîne et bloque des cartes !", type: "malus" },
    'lightning': { text: "PIÈGE : Rétrécit toutes les cartes !", type: "malus" },
    'poison': { text: "PIÈGE : Renverse l'écran (Poison) !", type: "malus" },
    'shyguy': { text: "PIÈGE : Les cartes fuient la souris !", type: "malus" },
    'cherry': { text: "PIÈGE : Dédouble votre curseur !", type: "malus" },

    'default': { text: "Personnage classique.", type: "neutral" }
};

// --- GESTION DU SKIN ---
let currentSkin = localStorage.getItem('mario_skin') || 'skin-block';

// --- GESTION DE L'ALBUM (STOCKAGE LOCAL) ---
let unlockedCharacters = JSON.parse(localStorage.getItem('mario_album')) || [];

// --- GESTION DE LA SÉLECTION ---
let selectedCharsForGame = [];
let targetPairCount = 0;

bgMusic.volume = lastVolume;

const levels = {
    easy: { pairs: 6, cols: 4, time: 40, lives: 5, starTime: 1000 },
    medium: { pairs: 10, cols: 5, time: 60, lives: 10, starTime: 1500 },
    hard: { pairs: 15, cols: 6, time: 90, lives: 15, starTime: 2000 }
};

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('mario_memory_theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeBtn.innerText = "☀️";
    } else {
        themeBtn.innerText = "🌗";
    }
});

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeBtn.innerText = "☀️";
        localStorage.setItem('mario_memory_theme', 'dark');
    } else {
        themeBtn.innerText = "🌗";
        localStorage.setItem('mario_memory_theme', 'light');
    }
}

volumeSlider.addEventListener('input', function () {
    bgMusic.volume = this.value;
    updateMuteIcon(this.value);
    if (this.value > 0) lastVolume = this.value;
});

function toggleMute() {
    if (bgMusic.volume > 0) {
        lastVolume = bgMusic.volume;
        bgMusic.volume = 0;
        volumeSlider.value = 0;
    } else {
        bgMusic.volume = lastVolume || 0.3;
        volumeSlider.value = bgMusic.volume;
    }
    updateMuteIcon(bgMusic.volume);
}

function updateMuteIcon(val) {
    if (val == 0) muteBtn.innerText = "🔇";
    else if (val < 0.5) muteBtn.innerText = "🔉";
    else muteBtn.innerText = "🔊";
}

function playSound(audioElement) {
    if (!audioElement) return;

    if (audioElement.id === 'sfxSwish') {
        let src = audioElement.currentSrc;
        if (!src) {
            const sourceTag = audioElement.querySelector('source');
            if (sourceTag) src = sourceTag.src;
        }

        if (src) {
            const sound = new Audio(src);
            sound.volume = volumeSlider.value;
            sound.play().catch(() => { });
        }
        return;
    }

    audioElement.volume = volumeSlider.value;
    audioElement.currentTime = 0;
    audioElement.play().catch(() => { });
}

// --- NETTOYAGE GLOBAL ---
function clearAllEffects() {
    clearShyGuyEffect();
    clearCherryEffect();

    document.body.classList.remove(
        'rotate-screen',
        'poison-fog',
        'frozen-state',
        'bowser-active',
        'shyguy-mode',
        'cursor-hidden',
        'thunder-flash',
        'chomp-flash',
        'one-up-state',
        'danger-state'
    );

    const board = document.getElementById('gameBoard');
    if (board) {
        board.classList.remove('ghost-blur', 'tiny-cards');
        const cards = board.querySelectorAll('.memory-card');
        cards.forEach(c => c.style.transform = '');
    }

    const msg = document.querySelector('.ghost-text');
    if (msg) msg.remove();
    document.querySelectorAll('.ink-spot').forEach(el => el.remove());

    isBowserActive = false;
    ghostMode = 0;
    blooperMode = 0;
    isIceActive = false;
    isChompActive = false;
    isTinyMode = false;
    isPoisonActive = false;
    isShyGuyActive = false;
    isCherryActive = false;
}

// --- FIX SHYGUY ---
function clearShyGuyEffect() {
    isShyGuyActive = false;
    document.body.classList.remove('shyguy-mode');

    // Nettoyage du Listener
    if (shyguyHandler) {
        document.removeEventListener('mousemove', shyguyHandler);
        shyguyHandler = null;
    }

    // Nettoyage du Timeout (IMPORTANT)
    if (shyguyTimeout) {
        clearTimeout(shyguyTimeout);
        shyguyTimeout = null;
    }

    // Réinitialiser la position des cartes
    document.querySelectorAll('.memory-card').forEach(c => {
        c.style.transform = '';
    });
}

function clearCherryEffect() {
    isCherryActive = false;
    const fake = document.querySelector('.fake-cursor');
    if (fake) fake.remove();

    if (cherryHandler) {
        document.removeEventListener('mousemove', cherryHandler);
        cherryHandler = null;
    }
    if (magicClickHandler) {
        document.removeEventListener('click', magicClickHandler, true);
        magicClickHandler = null;
    }
    if (cherryInterval) {
        clearInterval(cherryInterval);
        cherryInterval = null;
    }
    document.body.classList.remove('cursor-hidden');
}

function goToMainMenu() {
    document.getElementById('winMessage').style.display = 'none';
    document.getElementById('loseMessage').style.display = 'none';
    pauseMenu.style.display = 'none';
    selectionMenu.style.display = 'none';
    customMenu.style.display = 'none';
    skinMenu.style.display = 'none';
    albumMenu.style.display = 'none';
    startMenu.style.display = 'flex';
    countdownOverlay.style.display = 'none';

    clearInterval(timerInterval);
    gameBoard.innerHTML = '';
    isPaused = false;
    isGameOver = false;

    clearAllEffects();

    bgMusic.pause();
    bgMusic.currentTime = 0;
    bgMusic.playbackRate = 1.0;
    sfxGameOver.pause();
    sfxWin.pause();
    sfxBowser.pause();
}

function togglePause() {
    if (startMenu.style.display === 'flex' ||
        selectionMenu.style.display === 'flex' ||
        customMenu.style.display === 'flex' ||
        skinMenu.style.display === 'flex' ||
        albumMenu.style.display === 'flex' ||
        countdownOverlay.style.display === 'flex' ||
        document.getElementById('helpMenu').style.display === 'flex') return;

    if (document.getElementById('winMessage').style.display === 'block' ||
        document.getElementById('loseMessage').style.display === 'block') return;

    if (!isPaused) {
        isPaused = true;
        clearInterval(timerInterval);
        playSound(sfxPause);
        pauseMenu.style.display = 'flex';
        bgMusic.pause();
    } else {
        isPaused = false;
        pauseMenu.style.display = 'none';
        timerInterval = setInterval(updateTimer, 1000);
        if (volumeSlider.value > 0 && !isBowserActive) bgMusic.play();
    }
}

function toggleHelp() {
    const helpMenu = document.getElementById('helpMenu');
    if (helpMenu.style.display === 'none' || helpMenu.style.display === '') {
        helpMenu.style.display = 'flex';
        if (!isPaused && !isGameOver && startMenu.style.display !== 'flex' && selectionMenu.style.display !== 'flex') {
            isPaused = true;
            clearInterval(timerInterval);
            bgMusic.pause();
        }
    } else {
        helpMenu.style.display = 'none';
        if (isPaused && document.getElementById('pauseMenu').style.display === 'none' && !isGameOver && startMenu.style.display !== 'flex') {
            isPaused = false;
            timerInterval = setInterval(updateTimer, 1000);
            if (volumeSlider.value > 0 && !isBowserActive) bgMusic.play();
        }
    }
}

function restartCurrentLevel() {
    pauseMenu.style.display = 'none';
    document.getElementById('winMessage').style.display = 'none';
    document.getElementById('loseMessage').style.display = 'none';
    sfxGameOver.pause();
    sfxWin.pause();

    startCountdown();
}

// --- FONCTIONS CUSTOM ---
function openCustomMenu() {
    startMenu.style.display = 'none';
    customMenu.style.display = 'flex';
}

// --- FONCTIONS SKIN ---
function openSkinMenu() {
    startMenu.style.display = 'none';
    skinMenu.style.display = 'flex';
}

function updateSkinSelectionUI(selectedSkinName) {
    // 1. Désactiver toutes les sélections précédentes
    const allOptions = document.querySelectorAll('#skinMenu .skin-option');
    allOptions.forEach(opt => opt.classList.remove('selected'));

    // 2. Activer l'option correspondante
    const selectedElement = document.getElementById(`${selectedSkinName}-option`);
    if (selectedElement) {
        selectedElement.classList.add('selected');
    }
}
function openSkinMenu() {
    startMenu.style.display = 'none';
    skinMenu.style.display = 'flex';

    // NOUVEAU : Mettre à jour l'affichage immédiatement à l'ouverture du menu
    updateSkinSelectionUI(currentSkin); //
}
function selectSkin(skinName) {
    currentSkin = skinName;
    localStorage.setItem('mario_skin', skinName);

    // NOUVEAU : Mise à jour de l'UI pour que l'indicateur soit visible immédiatement
    // si l'utilisateur revient dans le menu Skins.
    updateSkinSelectionUI(currentSkin); //

    playSound(document.getElementById('sfxFlip'));
    skinMenu.style.display = 'none';
    startMenu.style.display = 'flex';
}

// --- FONCTIONS ALBUM ---
function openAlbumMenu() {
    startMenu.style.display = 'none';
    albumMenu.style.display = 'flex';
    renderAlbumGrid();
}

function renderAlbumGrid() {
    const grid = document.getElementById('albumGrid');
    const progressText = document.getElementById('albumProgress');
    grid.innerHTML = '';

    let unlockedCount = 0;

    allCharacters.forEach(char => {
        const isUnlocked = unlockedCharacters.includes(char.name);
        if (isUnlocked) unlockedCount++;

        const div = document.createElement('div');
        div.classList.add('album-item');
        if (isUnlocked) {
            div.classList.add('unlocked');
        } else {
            div.classList.add('locked');
        }

        div.innerHTML = `<img src="${char.img}" alt="${char.name}">`;

        if (isUnlocked) {
            div.title = char.name.toUpperCase();
        } else {
            div.title = "???";
        }

        grid.appendChild(div);
    });

    progressText.innerText = `Progression : ${unlockedCount} / ${allCharacters.length} débloqués`;
}

function setupCustomGame() {
    const p = parseInt(document.getElementById('customPairs').value);
    const l = parseInt(document.getElementById('customLives').value);
    const t = parseInt(document.getElementById('customTime').value);

    const totalCards = p * 2;
    const c = Math.ceil(Math.sqrt(totalCards));

    const uniqueKey = `custom_p${p}_l${l}_t${t}`;

    levels[uniqueKey] = {
        pairs: p,
        cols: c,
        time: t,
        lives: l,
        starTime: 1500
    };

    customMenu.style.display = 'none';
    openSelectionMenu(uniqueKey);
}

// --- LOGIQUE SÉLECTION ---
function openSelectionMenu(levelKey) {
    currentLevelKey = levelKey;
    targetPairCount = levels[levelKey].pairs;
    selectedCharsForGame = [];

    let shuffled = [...allCharacters];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    selectedCharsForGame = shuffled.slice(0, targetPairCount);

    renderSelectionGrid();
    updateSelectionUI();

    startMenu.style.display = 'none';
    selectionMenu.style.display = 'flex';
}

function renderSelectionGrid() {
    const grid = document.getElementById('selectionGrid');
    grid.innerHTML = '';

    allCharacters.forEach((char, index) => {
        const div = document.createElement('div');
        div.classList.add('select-item');

        const isSelected = selectedCharsForGame.some(c => c.name === char.name);
        if (isSelected) div.classList.add('selected');

        div.innerHTML = `<img src="${char.img}" alt="${char.name}">`;
        div.onclick = () => toggleSelection(char, div);

        div.onmouseenter = () => showDescription(char.name);
        div.onmouseleave = () => resetDescription();

        grid.appendChild(div);
    });
}

function showDescription(name) {
    const descBox = document.getElementById('charDescription');
    const info = descriptions[name] || descriptions['default'];

    descBox.innerText = info.text;

    if (info.type === 'bonus') descBox.style.color = '#44D62C';
    else if (info.type === 'malus') descBox.style.color = '#E52521';
    else descBox.style.color = '#333';
}

function resetDescription() {
    const descBox = document.getElementById('charDescription');
    descBox.innerText = "Survole un personnage pour voir son effet.";
    descBox.style.color = '#333';
}

function toggleSelection(char, div) {
    const index = selectedCharsForGame.findIndex(c => c.name === char.name);

    if (index > -1) {
        selectedCharsForGame.splice(index, 1);
        div.classList.remove('selected');
    } else {
        if (selectedCharsForGame.length < targetPairCount) {
            selectedCharsForGame.push(char);
            div.classList.add('selected');
        }
    }
    playSound(document.getElementById('sfxFlip'));
    updateSelectionUI();
}

function deselectAll() {
    selectedCharsForGame = [];
    renderSelectionGrid();
    updateSelectionUI();
    playSound(document.getElementById('sfxFlip'));
}

function updateSelectionUI() {
    const count = selectedCharsForGame.length;
    document.getElementById('selectionTitle').innerHTML = `Sélectionne <b>${targetPairCount}</b> personnages<br>(${count} / ${targetPairCount})`;

    const btn = document.getElementById('btnStartGame');
    if (count === targetPairCount) {
        btn.classList.remove('btn-disabled');
        btn.disabled = false;
    } else {
        btn.classList.add('btn-disabled');
        btn.disabled = true;
    }
}

function randomSelection() {
    let shuffled = [...allCharacters];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    selectedCharsForGame = shuffled.slice(0, targetPairCount);
    renderSelectionGrid();
    updateSelectionUI();
    playSound(document.getElementById('sfxFlip'));
}

function confirmSelection() {
    if (selectedCharsForGame.length !== targetPairCount) return;
    selectionMenu.style.display = 'none';
    startCountdown();
}

function startCountdown() {
    countdownOverlay.style.display = 'flex';
    const sfxFlip = document.getElementById('sfxFlip');
    const sfxStart = document.getElementById('sfxStart');

    let count = 3;
    countdownText.innerText = count;
    playSound(sfxFlip);

    const resetAnim = () => {
        countdownText.style.animation = 'none';
        countdownText.offsetHeight;
        countdownText.style.animation = 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    };

    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownText.innerText = count;
            playSound(sfxFlip);
            resetAnim();
        } else if (count === 0) {
            countdownText.innerText = "GO!";
            playSound(sfxStart);
            resetAnim();
        } else {
            clearInterval(interval);
            countdownOverlay.style.display = 'none';
            launchGameLogic();
        }
    }, 1000);
}

function launchGameLogic() {
    const level = levels[currentLevelKey];
    isGameOver = false;
    isBowserActive = false;
    ghostMode = 0;
    blooperMode = 0;
    isIceActive = false;
    isChompActive = false;
    isTinyMode = false;
    isPoisonActive = false;

    clearShyGuyEffect();
    clearCherryEffect();

    const board = document.getElementById('gameBoard');
    board.classList.remove('ghost-blur');
    board.classList.remove('tiny-cards');
    document.body.classList.remove('rotate-screen');
    const msg = document.querySelector('.ghost-text');
    if (msg) msg.remove();

    document.querySelectorAll('.ink-spot').forEach(el => el.remove());

    let musicSrc = "audio/theme.mp3";
    if (currentLevelKey === 'medium') musicSrc = "audio/theme64.mp3";
    if (currentLevelKey === 'hard') musicSrc = "audio/castle.mp3";

    bgMusic.src = musicSrc;
    bgMusic.load();
    bgMusic.currentTime = 0;
    bgMusic.playbackRate = 1.0;

    resetBoard();

    matchCount = 0;
    score = 0;
    scoreBase = 0;
    scoreTimeBonus = 0;
    scoreLifeBonus = 0;

    comboCount = 0;
    scoreMultiplier = 1;
    scoreDisplay.innerText = '0';
    multiplierDisplay.innerText = 'x1';

    totalPairs = level.pairs;
    timeLeft = level.time;
    lives = level.lives;
    isPaused = false;

    timerDisplay.innerText = timeLeft;
    livesDisplay.innerText = lives;
    timerDisplay.classList.remove('time-urgent');
    livesDisplay.parentElement.classList.remove('shake');
    bonusIndicator.classList.remove('bonus-active');
    lifeBonusIndicator.classList.remove('bonus-active');
    document.body.classList.remove('bowser-active');
    document.body.classList.remove('danger-state');
    document.body.classList.remove('frozen-state');
    document.body.classList.remove('one-up-state');
    document.body.classList.remove('chomp-flash');
    document.body.classList.remove('thunder-flash');
    document.body.classList.remove('poison-fog');

    bowserMsg.style.display = 'none';

    const savedBest = localStorage.getItem(`mario_best_${currentLevelKey}`);
    bestScoreDisplay.innerText = savedBest ? savedBest : 0;

    let deckPart1 = selectedCharsForGame.map(c => ({ ...c }));
    let deckPart2 = selectedCharsForGame.map(c => ({ ...c }));
    let deck = [...deckPart1, ...deckPart2];

    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    const cardWidth = `calc(${100 / level.cols}% - 16px)`;
    gameBoard.innerHTML = '';

    // 1. VERROUILLER LE PLATEAU
    lockBoard = true;

    deck.forEach((char, index) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.style.width = cardWidth;
        card.dataset.name = char.name;

        // 2. CARTE CACHÉE
        card.style.opacity = '0';

        card.innerHTML = `
                <div class="front-face"><img src="${char.img}" alt="${char.name}"></div>
                <div class="back-face ${currentSkin}"></div>
            `;

        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);

        // 3. ANIMATION
        setTimeout(() => {
            if (!isGameOver) {
                card.classList.add('deal-anim');
                card.style.opacity = '1';
                playSound(sfxSwish);
            }
        }, index * 100);
    });

    // 4. DÉMARRER A LA FIN DE LA DISTRIBUTION
    clearInterval(timerInterval);

    const dealingDuration = deck.length * 100 + 500;
    setTimeout(() => {
        if (!isGameOver && !isPaused && startMenu.style.display === 'none') {
            document.querySelectorAll('.memory-card').forEach(c => c.classList.remove('deal-anim'));

            lockBoard = false;
            timerInterval = setInterval(updateTimer, 1000);
            if (volumeSlider.value > 0) bgMusic.play().catch(() => { });
        }
    }, dealingDuration);
}

function updateTimer() {
    if (isPaused || isBowserActive) return;

    timeLeft--;
    checkDangerState();

    timerDisplay.innerText = timeLeft < 10 ? `0${timeLeft}` : timeLeft;

    if (timeLeft <= 10) {
        timerDisplay.classList.add('time-urgent');
        bgMusic.playbackRate = 1.5;
    } else {
        timerDisplay.classList.remove('time-urgent');
        bgMusic.playbackRate = 1.0;
    }

    if (timeLeft <= 0) gameOver("TIME UP !", "Le temps est écoulé...");
}

function flipCard() {
    if (this.classList.contains('matched')) return;
    if (this.classList.contains('chained-shake')) return;
    if (lockBoard || isPaused) return;
    if (this === firstCard) return;

    playSound(document.getElementById('sfxFlip'));

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    if (firstCard.dataset.name === 'bobomb') {
        playSound(sfxExplosion);

        firstCard.classList.add('bomb-explode');
        secondCard.classList.add('bomb-explode');

        lives--;
        livesDisplay.innerText = lives;
        checkDangerState();

        const livesContainer = livesDisplay.parentElement;
        livesContainer.classList.remove('shake');
        void livesContainer.offsetWidth;
        livesContainer.classList.add('shake');

        const rect = firstCard.getBoundingClientRect();
        spawnFloatingText(rect.left + rect.width / 2, rect.top, "-1 VIE !", "#ff3333");

        comboCount = 0;
        scoreMultiplier = 1;
        multiplierDisplay.innerText = 'x1';

        matchCount++;

        if (lives <= 0) {
            setTimeout(() => {
                gameOver("BOUM !", "Tu as fait exploser un Bob-omb !");
            }, 1000);
            return;
        }

        if (matchCount === totalPairs) {
            setTimeout(() => {
                handleVictory();
            }, 1000);
            return;
        }

        setTimeout(() => {
            resetBoard();
        }, 1000);

        return;
    }

    firstCard.querySelector('.front-face').style.background = '#d4ffda';
    secondCard.querySelector('.front-face').style.background = '#d4ffda';

    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    matchCount++;

    let turnBase = 100 * scoreMultiplier;

    const rect = secondCard.getBoundingClientRect();
    spawnCoin(rect.left + rect.width / 2, rect.top, turnBase);

    let turnTime = timeLeft * 2;
    let turnLife = lives * 10;

    scoreBase += turnBase;
    scoreTimeBonus += turnTime;
    scoreLifeBonus += turnLife;

    score = scoreBase + scoreTimeBonus + scoreLifeBonus;
    scoreDisplay.innerText = score;

    scoreMultiplier++;
    multiplierDisplay.innerText = 'x' + scoreMultiplier;
    multiplierDisplay.classList.remove('multiplier-pop');
    void multiplierDisplay.offsetWidth;
    multiplierDisplay.classList.add('multiplier-pop');

    bonusIndicator.classList.remove('bonus-active');
    void bonusIndicator.offsetWidth;
    bonusIndicator.classList.add('bonus-active');
    setTimeout(() => {
        bonusIndicator.classList.remove('bonus-active');
    }, 1000);

    comboCount++;

    if (comboCount > 1) {
        const rect = secondCard.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top;
        spawnFloatingText(centerX, centerY - 50, "COMBO x" + comboCount + " !", "#FFD700");
    }

    if (comboCount % 3 === 0) {
        lives++;
        livesDisplay.innerText = lives;
        checkDangerState();
        playSound(sfx1up);

        lifeBonusIndicator.classList.remove('bonus-active');
        void lifeBonusIndicator.offsetWidth;
        lifeBonusIndicator.classList.add('bonus-active');
        setTimeout(() => {
            lifeBonusIndicator.classList.remove('bonus-active');
        }, 1000);
    }

    const isGameWon = (matchCount === totalPairs);

    if (firstCard.dataset.name === 'star' && !isGameWon) triggerStarEffect();
    if (firstCard.dataset.name === 'bowser' && !isGameWon) triggerBowserEffect();
    if (firstCard.dataset.name === 'fireflower' && !isGameWon) triggerFireFlowerEffect();
    if (firstCard.dataset.name === 'ghost' && !isGameWon) triggerGhostEffect();
    if (firstCard.dataset.name === 'blooper' && !isGameWon) triggerBlooperEffect();
    if (firstCard.dataset.name === 'kamek' && !isGameWon) triggerKamekEffect();

    if (firstCard.dataset.name === 'iceflower' && !isGameWon) triggerIceEffect();
    if (firstCard.dataset.name === '1up' && !isGameWon) trigger1UpEffect();
    if (firstCard.dataset.name === 'chainchomp' && !isGameWon) triggerChompEffect();
    if (firstCard.dataset.name === 'lightning' && !isGameWon) triggerThunderEffect();
    if (firstCard.dataset.name === 'poison' && !isGameWon) triggerPoisonEffect();
    if (firstCard.dataset.name === 'shyguy' && !isGameWon) triggerShyGuyEffect();
    if (firstCard.dataset.name === 'cherry' && !isGameWon) triggerCherryEffect();

    timeLeft += 5;
    timerDisplay.innerText = timeLeft < 10 ? `0${timeLeft}` : timeLeft;
    if (timeLeft > 10) {
        timerDisplay.classList.remove('time-urgent');
        bgMusic.playbackRate = 1.0;
    }
    checkDangerState();

    resetBoard();

    if (isGameWon) handleVictory();
}

function triggerStarEffect() {
    lockBoard = true;

    bgMusic.pause();
    const sfxStar = document.getElementById('sfxStar');
    playSound(sfxStar);

    const hiddenCards = document.querySelectorAll('.memory-card:not(.flip)');
    hiddenCards.forEach(card => card.classList.add('flip'));

    const duration = levels[currentLevelKey].starTime;

    setTimeout(() => {
        hiddenCards.forEach(card => card.classList.remove('flip'));
        lockBoard = false;

        sfxStar.pause();
        sfxStar.currentTime = 0;
        if (volumeSlider.value > 0 && !isPaused && !isGameOver && !isBowserActive) bgMusic.play();

    }, duration);
}

function triggerBowserEffect() {
    isBowserActive = true;
    lockBoard = true;

    bgMusic.pause();
    playSound(sfxBowser);
    document.body.classList.add('bowser-active');
    bowserMsg.style.display = 'block';

    const cards = document.querySelectorAll('.memory-card:not(.matched)');
    cards.forEach(c => {
        c.classList.add('magic-swap');
        c.style.animationIterationCount = "infinite";
    });

    setTimeout(() => {
        const allCards = Array.from(gameBoard.children);
        const matchedIndices = [];
        const unmatchedCards = [];

        allCards.forEach((card, index) => {
            if (card.classList.contains('matched')) {
                matchedIndices.push(index);
            } else {
                unmatchedCards.push(card);
            }
        });

        for (let i = unmatchedCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [unmatchedCards[i], unmatchedCards[j]] = [unmatchedCards[j], unmatchedCards[i]];
        }

        gameBoard.innerHTML = '';
        let unmatchedIndex = 0;

        for (let i = 0; i < allCards.length; i++) {
            if (matchedIndices.includes(i)) {
                gameBoard.appendChild(allCards[i]);
            } else {
                gameBoard.appendChild(unmatchedCards[unmatchedIndex]);
                unmatchedIndex++;
            }
        }

        document.body.classList.remove('bowser-active');
        bowserMsg.style.display = 'none';

        const allCardsNow = document.querySelectorAll('.memory-card');
        allCardsNow.forEach(c => {
            c.classList.remove('magic-swap');
            c.style.animationIterationCount = "";
        });

        isBowserActive = false;
        lockBoard = false;

        if (volumeSlider.value > 0 && !isPaused && !isGameOver) bgMusic.play();

    }, 4000);
}

function unflipCards() {
    lockBoard = true;

    comboCount = 0;
    scoreMultiplier = 1;
    multiplierDisplay.innerText = 'x1';

    lives--;
    livesDisplay.innerText = lives;
    checkDangerState();

    const livesContainer = livesDisplay.parentElement;
    livesContainer.classList.remove('shake');
    void livesContainer.offsetWidth;
    livesContainer.classList.add('shake');

    if (lives <= 0) {
        setTimeout(() => {
            gameOver("PLUS DE VIES !", "Sois plus prudent la prochaine fois !");
        }, 500);
        return;
    }

    setTimeout(() => {
        if (isGameOver) return;
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 800);
}

function resetBoard() {
    hasFlippedCard = false;
    firstCard = null;
    secondCard = null;

    if (!isBowserActive && !isIceActive) lockBoard = false;

    if (ghostMode === 2) {
        const board = document.getElementById('gameBoard');
        board.classList.remove('ghost-blur');
        const msg = document.querySelector('.ghost-text');
        if (msg) msg.remove();
        ghostMode = 0;
    }
    else if (ghostMode === 1) {
        ghostMode = 2;
    }

    if (blooperMode === 2) {
        document.querySelectorAll('.ink-spot').forEach(el => el.remove());
        const msg = document.querySelector('.ghost-text');
        if (msg) msg.remove();
        blooperMode = 0;
    }
    else if (blooperMode === 1) {
        blooperMode = 2;
    }
}

function gameOver(title, text) {
    isGameOver = true;
    clearInterval(timerInterval);
    bgMusic.pause();
    bgMusic.currentTime = 0;
    bgMusic.playbackRate = 1.0;

    clearAllEffects();

    playSound(sfxGameOver);

    const unrevealed = document.querySelectorAll('.memory-card:not(.matched):not(.flip)');
    unrevealed.forEach(card => card.classList.add('flip'));

    lockBoard = true;

    loseTitle.innerText = title;
    loseText.innerText = text;

    document.getElementById('albumUnlockMsg').style.display = 'none';

    setTimeout(() => {
        document.getElementById('loseMessage').style.display = 'block';
    }, 2500);
}

function handleVictory() {
    isGameOver = true;
    clearInterval(timerInterval);
    bgMusic.pause();
    bgMusic.currentTime = 0;
    bgMusic.playbackRate = 1.0;

    clearAllEffects();

    playSound(sfxWin);
    launchConfetti();

    const key = `mario_best_${currentLevelKey}`;
    const currentBest = parseInt(localStorage.getItem(key)) || 0;
    const newRecordText = document.getElementById('newRecordMsg');

    detailBase.innerText = scoreBase;
    detailTime.innerText = scoreTimeBonus;
    detailLife.innerText = scoreLifeBonus;
    document.getElementById('finalScore').innerText = score;

    if (score > currentBest) {
        localStorage.setItem(key, score);
        bestScoreDisplay.innerText = score;
        newRecordText.style.display = 'block';
    } else {
        newRecordText.style.display = 'none';
    }

    // --- DEBLOCAGE ALBUM ---
    let newUnlocks = 0;
    selectedCharsForGame.forEach(char => {
        if (!unlockedCharacters.includes(char.name)) {
            unlockedCharacters.push(char.name);
            newUnlocks++;
        }
    });

    if (newUnlocks > 0) {
        localStorage.setItem('mario_album', JSON.stringify(unlockedCharacters));
        document.getElementById('albumUnlockMsg').style.display = 'block';
        document.getElementById('albumUnlockMsg').innerText = `🎁 ${newUnlocks} nouveaux stickers débloqués !`;
    } else {
        document.getElementById('albumUnlockMsg').style.display = 'none';
    }

    setTimeout(() => {
        document.getElementById('winMessage').style.display = 'block';
    }, 500);
}

function spawnCoin(x, y, amount) {
    const coin = document.createElement('div');
    coin.classList.add('floating-coin');
    coin.innerText = "+" + amount;
    coin.style.left = Math.round(x) + 'px';
    coin.style.top = Math.round(y) + 'px';

    document.body.appendChild(coin);

    setTimeout(() => {
        coin.remove();
    }, 1000);
}

function spawnFloatingText(x, y, text, color) {
    const txt = document.createElement('div');
    txt.classList.add('floating-text');
    txt.innerText = text;
    txt.style.color = color;
    txt.style.left = Math.round(x) + 'px';
    txt.style.top = Math.round(y) + 'px';

    document.body.appendChild(txt);

    setTimeout(() => {
        txt.remove();
    }, 1000);
}

function launchConfetti() {
    const colors = ['#E52521', '#43B047', '#FBD000', '#049CD8', '#FF69B4'];
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = (Math.random() * 2 + 3) + 's';
        confetti.style.opacity = Math.random();
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 5000);
    }
}

function triggerFireFlowerEffect() {
    const unMatched = Array.from(document.querySelectorAll('.memory-card:not(.matched):not(.flip)'));

    if (unMatched.length >= 2) {
        const randomCard = unMatched[Math.floor(Math.random() * unMatched.length)];
        const nameToMatch = randomCard.dataset.name;
        const pair = document.querySelectorAll(`.memory-card[data-name="${nameToMatch}"]`);

        const sfxFireball = document.getElementById('sfxFireball');
        playSound(sfxFireball);

        setTimeout(() => {
            pair.forEach(card => {
                card.classList.add('flip');
                card.classList.add('matched');
                card.querySelector('.front-face').style.background = '#ffdcb0';
                // FIX DU CLICK SUR CARTE DEJA TROUVEE PAR FLEUR
                card.removeEventListener('click', flipCard);
            });

            matchCount++;
            score += 100 * scoreMultiplier;
            scoreDisplay.innerText = score;
            spawnCoin(window.innerWidth / 2, window.innerHeight / 2, 100);

            if (matchCount === totalPairs) handleVictory();
        }, 500);
    }
}

function triggerGhostEffect() {
    const board = document.getElementById('gameBoard');

    ghostMode = 1;
    board.classList.add('ghost-blur');

    const sfxBoo = document.getElementById('sfxBoo');
    playSound(sfxBoo);

    const msg = document.createElement('div');
    msg.classList.add('ghost-text');
    msg.innerText = "BOOUH ! C'EST FLOU !";
    document.body.appendChild(msg);
}

function triggerBlooperEffect() {
    blooperMode = 1;
    playSound(document.getElementById('sfxSplat'));

    for (let i = 0; i < 20; i++) {
        const ink = document.createElement('div');
        ink.classList.add('ink-spot');

        const size = Math.random() * 170 + 80;
        ink.style.width = size + 'px';
        ink.style.height = size + 'px';

        ink.style.left = Math.random() * 100 + 'vw';
        ink.style.top = Math.random() * 100 + 'vh';

        document.body.appendChild(ink);
    }

    const msg = document.createElement('div');
    msg.classList.add('ghost-text');
    msg.innerText = "SPLAT !";
    msg.style.zIndex = "3001";
    document.body.appendChild(msg);
}

function triggerKamekEffect() {
    let swapCount = 2;
    if (currentLevelKey === 'easy') swapCount = 2;
    else if (currentLevelKey === 'medium') swapCount = 3;
    else if (currentLevelKey === 'hard') swapCount = 4;
    else if (currentLevelKey.startsWith('custom')) {
        const pairs = levels[currentLevelKey].pairs;
        if (pairs <= 7) swapCount = 2;
        else if (pairs <= 15) swapCount = 4;
        else swapCount = 6;
    }

    // Sélectionner uniquement les cartes valides (ni trouvées, ni retournées, ni explosées)
    const candidates = Array.from(document.querySelectorAll('.memory-card:not(.matched):not(.flip):not(.bomb-explode)'));

    if (candidates.length < swapCount) return;

    const toSwap = [];
    for (let i = 0; i < swapCount; i++) {
        const randIndex = Math.floor(Math.random() * candidates.length);
        toSwap.push(candidates[randIndex]);
        candidates.splice(randIndex, 1);
    }

    // Sauvegarder l'état actuel (Nom ET Source de l'image)
    const states = toSwap.map(card => ({
        name: card.dataset.name,
        src: card.querySelector('.front-face img').src,
        alt: card.querySelector('.front-face img').alt
    }));

    const sfxKamek = document.getElementById('sfxKamek');
    playSound(sfxKamek);

    toSwap.forEach(card => {
        card.classList.add('magic-swap');
    });

    setTimeout(() => {
        // Mélange des états
        for (let i = states.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [states[i], states[j]] = [states[j], states[i]];
        }

        // Réapplication propre des données
        toSwap.forEach((card, index) => {
            card.dataset.name = states[index].name;
            const img = card.querySelector('.front-face img');
            img.src = states[index].src;
            img.alt = states[index].alt;

            card.classList.remove('magic-swap');
        });
    }, 500);
}

function resetBestScores() {
    if (confirm("Es-tu sûr de vouloir effacer tous les records ?")) {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('mario_best_')) {
                localStorage.removeItem(key);
            }
        });

        document.getElementById('bestScore').innerText = '0';
        alert("Tous les scores ont été remis à zéro !");
    }
}

bonusIndicator.addEventListener('animationend', () => {
    bonusIndicator.classList.remove('bonus-active');
});

lifeBonusIndicator.addEventListener('animationend', () => {
    lifeBonusIndicator.classList.remove('bonus-active');
});

document.addEventListener('keydown', (e) => {
    if (startMenu.style.display === 'flex' || selectionMenu.style.display === 'flex') return;

    switch (e.key.toLowerCase()) {
        case 'p':
            togglePause();
            break;
        case 'm':
            toggleMute();
            break;
        case 'escape':
            if (!isPaused) togglePause();
            else if (pauseMenu.style.display === 'flex') togglePause();
            break;
    }
});

function checkDangerState() {
    const body = document.body;
    if ((timeLeft <= 10 && timeLeft > 0) || (lives === 1)) {
        body.classList.add('danger-state');
    } else {
        body.classList.remove('danger-state');
    }
}

function triggerIceEffect() {
    let freezeDuration = 0;

    if (currentLevelKey === 'easy') freezeDuration = 3000;
    else if (currentLevelKey === 'medium') freezeDuration = 5000;
    else if (currentLevelKey === 'hard') freezeDuration = 8000;
    else if (currentLevelKey.startsWith('custom')) {
        const p = levels[currentLevelKey].pairs;
        if (p >= 2 && p <= 9) freezeDuration = 3000;
        else if (p >= 10 && p <= 14) freezeDuration = 5000;
        else if (p >= 15 && p <= 25) freezeDuration = 8000;
        else if (p >= 26) freezeDuration = 10000;
    }

    isIceActive = true;
    lockBoard = true;
    document.body.classList.add('frozen-state');

    try {
        const iceSfx = new Audio('audio/iceball.mp3');
        iceSfx.volume = volumeSlider.value;
        iceSfx.play().catch(() => { });
    } catch (e) { console.log("Audio error", e); }

    spawnFloatingText(window.innerWidth / 2, window.innerHeight / 2, "ÉCRAN GELÉ ! ❄️", "#00ffff");

    setTimeout(() => {
        isIceActive = false;
        lockBoard = false;
        document.body.classList.remove('frozen-state');
    }, freezeDuration);
}

function trigger1UpEffect() {
    document.body.classList.add('one-up-state');

    const sfx1up = document.getElementById('sfx1up');
    if (sfx1up) playSound(sfx1up);

    lives++;
    livesDisplay.innerText = lives;
    checkDangerState();

    spawnFloatingText(window.innerWidth / 2, window.innerHeight / 2, "+1 VIE !", "#44D62C");

    lifeBonusIndicator.classList.remove('bonus-active');
    void lifeBonusIndicator.offsetWidth;
    lifeBonusIndicator.classList.add('bonus-active');

    setTimeout(() => {
        document.body.classList.remove('one-up-state');
    }, 1000);
}

function triggerChompEffect() {
    let chainsCount = 0;
    let p = 0;

    if (currentLevelKey === 'easy') p = 6;
    else if (currentLevelKey === 'medium') p = 10;
    else if (currentLevelKey === 'hard') p = 15;
    else if (currentLevelKey.startsWith('custom')) {
        p = levels[currentLevelKey].pairs;
    }

    if (p >= 2 && p <= 4) chainsCount = 0;
    else if (p >= 5 && p <= 9) chainsCount = 3;
    else if (p >= 10 && p <= 15) chainsCount = 5;
    else if (p >= 16 && p <= 25) chainsCount = 7;
    else if (p >= 26) chainsCount = 8;

    const candidates = Array.from(document.querySelectorAll('.memory-card:not(.matched):not(.flip)'));
    if (chainsCount === 0 || candidates.length <= 4) return;

    isChompActive = true;
    document.body.classList.add('chomp-flash');

    try {
        const barkSfx = new Audio('audio/bark.mp3');
        barkSfx.volume = volumeSlider.value;
        barkSfx.play().catch(() => { });
    } catch (e) { console.log(e); }

    spawnFloatingText(window.innerWidth / 2, window.innerHeight / 2, "ATTENTION CHOMP ! 🐶", "#555");

    for (let i = 0; i < chainsCount; i++) {
        if (candidates.length === 0) break;
        const randIndex = Math.floor(Math.random() * candidates.length);
        const card = candidates[randIndex];

        card.classList.add('chained-shake');

        candidates.splice(randIndex, 1);
    }

    setTimeout(() => {
        document.body.classList.remove('chomp-flash');
    }, 500);

    setTimeout(() => {
        const chainedCards = document.querySelectorAll('.chained-shake');
        chainedCards.forEach(c => c.classList.remove('chained-shake'));
        isChompActive = false;
    }, 10000);
}

function triggerThunderEffect() {
    let duration = 5000;
    if (currentLevelKey === 'medium') duration = 8000;
    else if (currentLevelKey === 'hard') duration = 12000;
    else if (currentLevelKey.startsWith('custom')) {
        const p = levels[currentLevelKey].pairs;
        if (p > 15) duration = 10000;
    }

    try {
        const thunderSfx = new Audio('audio/thunder.mp3');
        thunderSfx.volume = volumeSlider.value;
        thunderSfx.play().catch(() => { });
    } catch (e) { }

    document.body.classList.add('thunder-flash');
    setTimeout(() => document.body.classList.remove('thunder-flash'), 500);

    spawnFloatingText(window.innerWidth / 2, window.innerHeight / 2, "MINI-KART ! ⚡", "#FFD700");

    isTinyMode = true;
    gameBoard.classList.add('tiny-cards');

    setTimeout(() => {
        gameBoard.classList.remove('tiny-cards');
        isTinyMode = false;
    }, duration);
}

// --- FONCTION CHAMPI POISON ---
function triggerPoisonEffect() {
    isPoisonActive = true;
    document.body.classList.add('rotate-screen'); // Rotation 180deg
    document.body.classList.add('poison-fog');    // Brouillard violet

    try {
        const warpSfx = new Audio('audio/warp.mp3');
        warpSfx.volume = volumeSlider.value;
        warpSfx.play().catch(() => { });
    } catch (e) { }

    spawnFloatingText(window.innerWidth / 2, window.innerHeight / 2, "TÊTE EN BAS ! ☠️", "#8A2BE2");

    setTimeout(() => {
        document.body.classList.remove('rotate-screen');
        document.body.classList.remove('poison-fog');
        isPoisonActive = false;
    }, 10000); // 10 secondes
}

// --- FONCTION SHYGUY (MASKASS) - CORRIGEE ---
function triggerShyGuyEffect() {
    // Nettoyage préventif pour éviter les conflits (zombie listeners)
    clearShyGuyEffect();

    isShyGuyActive = true;
    document.body.classList.add('shyguy-mode');

    try {
        playSound(sfxShyGuy);
    } catch (e) { console.log("Erreur audio Shyguy", e); }

    spawnFloatingText(window.innerWidth / 2, window.innerHeight / 2, "FUITE ! 🏃", "#ff69b4");

    // Définition de la fonction de fuite
    shyguyHandler = (e) => {
        const cards = document.querySelectorAll('.memory-card');
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const radius = 250; // Rayon de détection AUGMENTÉ

        cards.forEach(card => {
            // --- FIX CRITIQUE : IGNORER CARTES TROUVÉES OU RETOURNÉES ---
            if (card.classList.contains('matched') || card.classList.contains('flip')) {
                if (isTinyMode) card.style.transform = 'scale(0.6)';
                else card.style.transform = '';
                return;
            }

            const rect = card.getBoundingClientRect();
            const cardX = rect.left + rect.width / 2;
            const cardY = rect.top + rect.height / 2;

            // Distance entre la souris et le centre de la carte
            const dist = Math.hypot(mouseX - cardX, mouseY - cardY);

            if (dist < radius) {
                // Calcul de l'angle pour fuir à l'opposé
                const angle = Math.atan2(cardY - mouseY, cardX - mouseX);
                // La force de répulsion augmente plus on est proche
                const force = (radius - dist) * 2.5;

                const moveX = Math.cos(angle) * force;
                const moveY = Math.sin(angle) * force;

                // On applique le mouvement.
                // On vérifie si le mode 'Tiny' (éclair) est actif pour ne pas écraser le scale
                let baseTransform = '';
                if (isTinyMode) baseTransform = 'scale(0.6)';
                else baseTransform = 'scale(1)';

                card.style.transform = `${baseTransform} translate(${moveX}px, ${moveY}px)`;
            } else {
                // Si la souris est loin, on reset la position (sauf si TinyMode)
                if (isTinyMode) card.style.transform = 'scale(0.6)';
                else card.style.transform = '';
            }
        });
    };

    // Activation de l'écouteur
    document.addEventListener('mousemove', shyguyHandler);

    // Arrêt après 8 secondes (Stockage de l'ID)
    shyguyTimeout = setTimeout(() => {
        clearShyGuyEffect();
    }, 8000);
}

// --- FONCTION DOUBLE CERISE (FAKE CURSOR) ---
function triggerCherryEffect() {
    isCherryActive = true;
    spawnFloatingText(window.innerWidth / 2, window.innerHeight / 2, "DOUBLE CURSEUR ! 🍒", "#ff69b4");

    // Création du faux curseur
    const fakeCursor = document.createElement('img');
    fakeCursor.src = 'curseur/cursor.cur';
    fakeCursor.classList.add('fake-cursor');
    fakeCursor.style.display = 'none';
    document.body.appendChild(fakeCursor);

    // Gestionnaire pour le suivi de souris
    cherryHandler = (e) => {
        // Décalage 125px
        fakeCursor.style.left = (e.clientX + CHERRY_OFFSET_X) + 'px';
        fakeCursor.style.top = (e.clientY + CHERRY_OFFSET_Y) + 'px';

        // Détection du curseur POINTER (main) sous la vraie souris
        let cursorType = 'default';
        let el = e.target;

        // Remontée dans le DOM pour trouver un style 'pointer'
        while (el && el !== document.body && el !== document) {
            const style = window.getComputedStyle(el);
            if (style.cursor && style.cursor.includes('pointer')) {
                cursorType = 'pointer';
                break;
            }
            el = el.parentElement;
        }

        // Mise à jour de l'image du faux curseur
        if (cursorType === 'pointer') {
            if (!fakeCursor.src.includes('pointer.cur')) {
                fakeCursor.src = 'curseur/pointer.cur';
            }
        } else {
            if (!fakeCursor.src.includes('cursor.cur')) {
                fakeCursor.src = 'curseur/cursor.cur';
            }
        }
    };

    document.addEventListener('mousemove', cherryHandler);

    // Gestion du clic magique (quand le vrai curseur est caché)
    magicClickHandler = (e) => {
        if (!e.isTrusted) return;

        // Si le vrai curseur est caché, on intercepte le clic
        if (document.body.classList.contains('cursor-hidden')) {
            e.stopPropagation();
            e.preventDefault();

            // Calcul de la position du clone
            const fakeX = e.clientX + CHERRY_OFFSET_X;
            const fakeY = e.clientY + CHERRY_OFFSET_Y;

            // On cache le clone temporairement pour trouver l'élément dessous
            fakeCursor.style.display = 'none';
            let target = document.elementFromPoint(fakeX, fakeY);
            fakeCursor.style.display = 'block';

            if (target) {
                const clickable = target.closest('.memory-card') || target.closest('button') || target.closest('.hud-btn');

                // --- FIX CRITIQUE : NE PAS CLIQUER SI CARTE DÉJÀ TROUVÉE ---
                // On vérifie 'matched' (trouvée) ET 'flip' (retournée, ex: première carte)
                if (clickable && !clickable.classList.contains('matched') && !clickable.classList.contains('flip')) {
                    clickable.click();

                    // Feedback visuel
                    fakeCursor.style.transform = "scale(0.8)";
                    setTimeout(() => fakeCursor.style.transform = "scale(1)", 100);
                }
            }
        }
    };
    document.addEventListener('click', magicClickHandler, true);

    // Intervalle pour l'alternance stricte
    let isRealCursorVisible = true;
    cherryInterval = setInterval(() => {
        isRealCursorVisible = !isRealCursorVisible;

        if (isRealCursorVisible) {
            // Phase 1 : Vrai visible, Faux invisible
            document.body.classList.remove('cursor-hidden');
            fakeCursor.style.display = 'none';
        } else {
            // Phase 2 : Vrai invisible, Faux visible
            document.body.classList.add('cursor-hidden');
            fakeCursor.style.display = 'block';
        }
    }, 1000); // CHANGE TOUTES LES SECONDES

    // Durée totale : 15 secondes
    setTimeout(() => {
        clearCherryEffect();
    }, 15000);
}