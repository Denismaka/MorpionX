// État du jeu
let player = "X";
let game = [];
let lock = false;
let aiMode = false;
let gridSize = 3;
let difficulty = "medium";
let soundEnabled = true;
let tournamentMode = false;
let tournamentStats = { games: 0, winsX: 0, winsO: 0 };
let gameHistory = [];
let statistics = {
    totalGames: 0,
    winsX: 0,
    winsO: 0,
    draws: 0,
    winStreak: 0,
    currentStreak: 0,
    lastWinner: null,
    totalPlayTime: 0,
    gameStartTime: null
};
let onlineMode = false;
let socket = null;
let roomId = null;
let isOnlineHost = false;

// Éléments DOM
const info = document.querySelector(".resultat");
let cells = [];
const restartBtn = document.getElementById("restartBtn");
const aiModeBtn = document.getElementById("aiModeBtn");
const settingsBtn = document.getElementById("settingsBtn");
const statsBtn = document.getElementById("statsBtn");
const historyBtn = document.getElementById("historyBtn");
const onlineModeBtn = document.getElementById("onlineModeBtn");
const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const gameContainer = document.getElementById("gameContainer");
const settingsPanel = document.getElementById("settingsPanel");
const statsPanel = document.getElementById("statsPanel");
const historyPanel = document.getElementById("historyPanel");
const tournamentPanel = document.getElementById("tournamentPanel");
const onlinePanel = document.getElementById("onlinePanel");

// Combinaisons gagnantes (sera généré dynamiquement selon la taille)
let combinaisonsGagnantes = [];

// Scores
let scores = {
    X: 0,
    O: 0
};

// Système de sons
const soundSystem = {
    playMove: () => {
        if (!soundEnabled) return;
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 440;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    },
    
    playWin: () => {
        if (!soundEnabled) return;
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [523.25, 659.25, 783.99]; // C, E, G
        
        notes.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + index * 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.1 + 0.3);
            
            oscillator.start(audioContext.currentTime + index * 0.1);
            oscillator.stop(audioContext.currentTime + index * 0.1 + 0.3);
        });
    },
    
    playDraw: () => {
        if (!soundEnabled) return;
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 330;
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
};

// Charger les données depuis le localStorage
loadGameData();

// Initialisation
initGame();

function initGame() {
    generateWinningCombinations();
    createGrid();
    updateDisplay();
    setupEventListeners();
    updateScoreboard();
    applyTheme(localStorage.getItem('morpionXTheme') || 'default');
    
    // Charger les préférences
    const savedDifficulty = localStorage.getItem('morpionXDifficulty');
    if (savedDifficulty) {
        difficulty = savedDifficulty;
        document.getElementById('difficultySelect').value = savedDifficulty;
    }
    
    const savedGridSize = localStorage.getItem('morpionXGridSize');
    if (savedGridSize) {
        gridSize = parseInt(savedGridSize);
        document.getElementById('gridSizeSelect').value = savedGridSize;
        generateWinningCombinations();
        createGrid();
    }
    
    const savedSound = localStorage.getItem('morpionXSound');
    if (savedSound !== null) {
        soundEnabled = savedSound === 'true';
        document.getElementById('soundEnabled').checked = soundEnabled;
    }
}

function generateWinningCombinations() {
    combinaisonsGagnantes = [];
    const size = gridSize;
    
    // Lignes horizontales
    for (let i = 0; i < size; i++) {
        const combo = [];
        for (let j = 0; j < size; j++) {
            combo.push(i * size + j);
        }
        combinaisonsGagnantes.push(combo);
    }
    
    // Lignes verticales
    for (let i = 0; i < size; i++) {
        const combo = [];
        for (let j = 0; j < size; j++) {
            combo.push(j * size + i);
        }
        combinaisonsGagnantes.push(combo);
    }
    
    // Diagonale principale
    const diag1 = [];
    for (let i = 0; i < size; i++) {
        diag1.push(i * size + i);
    }
    combinaisonsGagnantes.push(diag1);
    
    // Diagonale secondaire
    const diag2 = [];
    for (let i = 0; i < size; i++) {
        diag2.push(i * size + (size - 1 - i));
    }
    combinaisonsGagnantes.push(diag2);
}

function createGrid() {
    gameContainer.innerHTML = '';
    gameContainer.className = `container grid-${gridSize}`;
    game = new Array(gridSize * gridSize).fill("");
    cells = [];
    
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement("div");
        cell.className = "case";
        cell.setAttribute("data-index", i);
        cell.addEventListener("click", handleClick);
        gameContainer.appendChild(cell);
        cells.push(cell);
    }
}

function setupEventListeners() {
    restartBtn.addEventListener("click", resetGame);
    aiModeBtn.addEventListener("click", toggleAIMode);
    settingsBtn.addEventListener("click", () => togglePanel('settings'));
    statsBtn.addEventListener("click", () => togglePanel('stats'));
    historyBtn.addEventListener("click", () => togglePanel('history'));
    onlineModeBtn.addEventListener("click", () => togglePanel('online'));
    
    document.getElementById("closeSettings").addEventListener("click", () => togglePanel('settings'));
    document.getElementById("closeStats").addEventListener("click", () => togglePanel('stats'));
    document.getElementById("closeHistory").addEventListener("click", () => togglePanel('history'));
    document.getElementById("closeTournament").addEventListener("click", () => togglePanel('tournament'));
    document.getElementById("closeOnline").addEventListener("click", () => togglePanel('online'));
    
    document.getElementById("gridSizeSelect").addEventListener("change", handleGridSizeChange);
    document.getElementById("difficultySelect").addEventListener("change", handleDifficultyChange);
    document.getElementById("themeSelect").addEventListener("change", handleThemeChange);
    document.getElementById("soundEnabled").addEventListener("change", handleSoundToggle);
    document.getElementById("tournamentMode").addEventListener("change", handleTournamentToggle);
    document.getElementById("resetStats").addEventListener("click", resetStatistics);
    document.getElementById("clearHistory").addEventListener("click", clearHistory);
    document.getElementById("resetTournament").addEventListener("click", resetTournament);
    
    document.getElementById("createRoomBtn").addEventListener("click", createRoom);
    document.getElementById("joinRoomBtn").addEventListener("click", joinRoom);
    document.getElementById("disconnectBtn").addEventListener("click", disconnectFromRoom);
}

function togglePanel(panelName) {
    const panels = {
        settings: settingsPanel,
        stats: statsPanel,
        history: historyPanel,
        tournament: tournamentPanel,
        online: onlinePanel
    };
    
    // Fermer tous les autres panels
    Object.values(panels).forEach(panel => {
        if (panel !== panels[panelName]) {
            panel.classList.add("hidden");
        }
    });
    
    const panel = panels[panelName];
    if (panel) {
        panel.classList.toggle("hidden");
        if (!panel.classList.contains("hidden")) {
            if (panelName === 'stats') updateStatsDisplay();
            if (panelName === 'history') updateHistoryDisplay();
            if (panelName === 'tournament') updateTournamentDisplay();
        }
    }
}

function handleGridSizeChange(e) {
    gridSize = parseInt(e.target.value);
    localStorage.setItem('morpionXGridSize', gridSize);
    generateWinningCombinations();
    createGrid();
    resetGame();
}

function handleDifficultyChange(e) {
    difficulty = e.target.value;
    localStorage.setItem('morpionXDifficulty', difficulty);
}

function handleThemeChange(e) {
    applyTheme(e.target.value);
    localStorage.setItem('morpionXTheme', e.target.value);
}

function applyTheme(themeName) {
    document.body.className = '';
    if (themeName !== 'default') {
        document.body.classList.add(`theme-${themeName}`);
    }
    document.getElementById('themeSelect').value = themeName;
}

function handleSoundToggle(e) {
    soundEnabled = e.target.checked;
    localStorage.setItem('morpionXSound', soundEnabled);
}

function handleTournamentToggle(e) {
    tournamentMode = e.target.checked;
    if (tournamentMode) {
        resetGame();
        tournamentStats = { games: 0, winsX: 0, winsO: 0 };
        updateTournamentDisplay();
    }
}

function handleClick(e) {
    // Vérifier les permissions en mode en ligne
    if (onlineMode) {
        const canPlay = (isOnlineHost && player === "X") || (!isOnlineHost && player === "O");
        if (!canPlay) {
            info.textContent = "Attendez votre tour...";
            return;
        }
    }
    
    const currentClick = e.target;
    const caseIndex = parseInt(currentClick.getAttribute("data-index"));

    if (game[caseIndex] !== "" || lock) {
        return;
    }

    // Jouer le coup
    playMove(caseIndex, player);
    soundSystem.playMove();
    
    // En mode en ligne, envoyer le coup et attendre la réponse de l'adversaire
    if (onlineMode) {
        sendMove(caseIndex);
        // Vérifier la fin de partie sans changer de joueur
        verification(false);
        // Changer de joueur localement pour indiquer que ce n'est plus notre tour
        // (même si on ne peut pas jouer l'autre symbole, cela nous empêche de rejouer)
        switchPlayer();
        return;
    }

    // Vérifier si le jeu est terminé (mode local)
    if (!lock) {
        verification(true);
        
        // Si mode IA et le jeu continue, faire jouer l'IA
        if (aiMode && !lock && player === "O") {
            setTimeout(() => {
                playAIMove();
            }, 500);
        }
    }
}

function playMove(index, currentPlayer) {
    game[index] = currentPlayer;
    const cell = cells[index];
    cell.textContent = currentPlayer;
    cell.classList.add("filled", currentPlayer.toLowerCase());
}

function verification(shouldSwitchPlayer = true) {
    let winningCombo = null;
    
    // Vérifier les combinaisons gagnantes
    for (let i = 0; i < combinaisonsGagnantes.length; i++) {
        const combinationsCheck = combinaisonsGagnantes[i];
        const values = combinationsCheck.map(idx => game[idx]);
        const firstValue = values[0];
        
        if (firstValue === "") continue;
        
        if (values.every(val => val === firstValue)) {
            winningCombo = combinationsCheck;
            lock = true;
            
            // Mettre en évidence la ligne gagnante
            highlightWinningCells(winningCombo);
            
            // Mettre à jour le score
            scores[player]++;
            saveScores();
            updateScoreboard();
            
            // Enregistrer la partie
            const gameData = {
                date: new Date().toISOString(),
                winner: player,
                gridSize: gridSize,
                duration: statistics.gameStartTime ? (Date.now() - statistics.gameStartTime) / 1000 : 0
            };
            gameHistory.unshift(gameData);
            if (gameHistory.length > 50) gameHistory.pop();
            saveGameHistory();
            
            // Mettre à jour les statistiques
            statistics.totalGames++;
            statistics.winsX += player === "X" ? 1 : 0;
            statistics.winsO += player === "O" ? 1 : 0;
            if (statistics.lastWinner === player) {
                statistics.currentStreak++;
            } else {
                statistics.currentStreak = 1;
            }
            statistics.winStreak = Math.max(statistics.winStreak, statistics.currentStreak);
            statistics.lastWinner = player;
            if (statistics.gameStartTime) {
                statistics.totalPlayTime += (Date.now() - statistics.gameStartTime) / 60000;
            }
            saveStatistics();
            
            // Mode tournoi
            if (tournamentMode) {
                tournamentStats.games++;
                tournamentStats.winsX += player === "X" ? 1 : 0;
                tournamentStats.winsO += player === "O" ? 1 : 0;
                saveTournamentStats();
                updateTournamentDisplay();
            }
            
            soundSystem.playWin();
            
            // Afficher le message de victoire
            info.textContent = `🎉 Le joueur ${player} a gagné !`;
            info.classList.add("winner");
            return;
        }
    }

    // Match nul
    if (!game.includes("")) {
        lock = true;
        
        // Enregistrer la partie
        const gameData = {
            date: new Date().toISOString(),
            winner: "draw",
            gridSize: gridSize,
            duration: statistics.gameStartTime ? (Date.now() - statistics.gameStartTime) / 1000 : 0
        };
        gameHistory.unshift(gameData);
        if (gameHistory.length > 50) gameHistory.pop();
        saveGameHistory();
        
        // Mettre à jour les statistiques
        statistics.totalGames++;
        statistics.draws++;
        statistics.currentStreak = 0;
        statistics.lastWinner = null;
        if (statistics.gameStartTime) {
            statistics.totalPlayTime += (Date.now() - statistics.gameStartTime) / 60000;
        }
        saveStatistics();
        
        // Mode tournoi
        if (tournamentMode) {
            tournamentStats.games++;
            saveTournamentStats();
            updateTournamentDisplay();
        }
        
        soundSystem.playDraw();
        info.textContent = "🤝 Match Nul !";
        info.classList.add("draw");
        return;
    }

    // Continuer le jeu (seulement si shouldSwitchPlayer est true)
    if (shouldSwitchPlayer) {
        switchPlayer();
    }
}

function highlightWinningCells(combo) {
    combo.forEach(index => {
        cells[index].classList.add("winning");
    });
}

function switchPlayer() {
    player = player === "X" ? "O" : "X";
    updateDisplay();
    updateScoreboard();
}

function updateDisplay() {
    info.textContent = `Au tour de ${player}`;
    info.classList.remove("winner", "draw");
}

function updateScoreboard() {
    scoreXEl.textContent = scores.X;
    scoreOEl.textContent = scores.O;
    
    // Mettre en évidence le joueur actif
    document.querySelector(".score-x").classList.toggle("active", player === "X");
    document.querySelector(".score-o").classList.toggle("active", player === "O");
}

function resetGame() {
    game = new Array(gridSize * gridSize).fill("");
    player = "X";
    lock = false;
    statistics.gameStartTime = Date.now();
    
    cells.forEach((cell) => {
        cell.textContent = "";
        cell.classList.remove("filled", "winning", "x", "o");
    });
    
    // En mode en ligne, envoyer le signal de redémarrage
    if (onlineMode && socket && socket.connected && isOnlineHost) {
        socket.emit('restart', roomId);
    }
    
    updateDisplay();
    updateScoreboard();
}

function toggleAIMode() {
    if (onlineMode) {
        alert("Le mode en ligne est actif. Déconnectez-vous d'abord du mode en ligne.");
        return;
    }
    
    aiMode = !aiMode;
    aiModeBtn.classList.toggle("active", aiMode);
    aiModeBtn.textContent = aiMode ? "👥 Mode Multijoueur" : "🤖 Mode Solo";
    
    if (aiMode) {
        info.textContent = "Mode Solo activé - Vous jouez X";
        onlineMode = false;
        if (socket) {
            socket.close();
            socket = null;
        }
        onlineModeBtn.classList.remove("active");
    }
    
    resetGame();
}

function playAIMove() {
    if (lock) return;
    
    const bestMove = getBestMove();
    if (bestMove !== -1) {
        playMove(bestMove, "O");
        soundSystem.playMove();
        verification();
    }
}

function getBestMove() {
    if (difficulty === "easy") {
        return getEasyMove();
    } else if (difficulty === "medium") {
        return getMediumMove();
    } else {
        return getHardMove();
    }
}

function getEasyMove() {
    // 70% de chance de faire un mauvais coup
    if (Math.random() < 0.7) {
        const availableMoves = game.map((cell, index) => cell === "" ? index : -1).filter(i => i !== -1);
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    return getMediumMove();
}

function getMediumMove() {
    // Priorité 1: Gagner si possible
    for (let combo of combinaisonsGagnantes) {
        const values = combo.map(idx => game[idx]);
        const oCount = values.filter(v => v === "O").length;
        const xCount = values.filter(v => v === "X").length;
        const emptyCount = values.filter(v => v === "").length;
        
        if (oCount === gridSize - 1 && emptyCount === 1) {
            return combo.find(idx => game[idx] === "");
        }
        
        if (xCount === gridSize - 1 && emptyCount === 1) {
            return combo.find(idx => game[idx] === "");
        }
    }
    
    // Priorité 2: Prendre le centre
    const center = Math.floor(gridSize * gridSize / 2);
    if (game[center] === "") return center;
    
    // Priorité 3: Prendre un coin
    const corners = [0, gridSize - 1, gridSize * (gridSize - 1), gridSize * gridSize - 1];
    const availableCorners = corners.filter(i => game[i] === "");
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    // Priorité 4: Case aléatoire
    const availableMoves = game.map((cell, index) => cell === "" ? index : -1).filter(i => i !== -1);
    if (availableMoves.length > 0) {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    return -1;
}

function getHardMove() {
    // Utiliser Minimax pour le niveau difficile
    let bestScore = -Infinity;
    let bestMove = -1;
    
    for (let i = 0; i < game.length; i++) {
        if (game[i] === "") {
            game[i] = "O";
            const score = minimax(game, 0, false);
            game[i] = "";
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    
    return bestMove !== -1 ? bestMove : getMediumMove();
}

function minimax(board, depth, isMaximizing) {
    const winner = checkWinner(board);
    
    if (winner === "O") return 10 - depth;
    if (winner === "X") return depth - 10;
    if (!board.includes("")) return 0;
    
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O";
                const score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "X";
                const score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner(board) {
    for (let combo of combinaisonsGagnantes) {
        const values = combo.map(idx => board[idx]);
        const firstValue = values[0];
        if (firstValue !== "" && values.every(val => val === firstValue)) {
            return firstValue;
        }
    }
    return null;
}

function saveScores() {
    localStorage.setItem("morpionXScores", JSON.stringify(scores));
}

function loadScores() {
    const savedScores = localStorage.getItem("morpionXScores");
    if (savedScores) {
        scores = JSON.parse(savedScores);
    }
}

function saveStatistics() {
    localStorage.setItem("morpionXStatistics", JSON.stringify(statistics));
}

function loadStatistics() {
    const saved = localStorage.getItem("morpionXStatistics");
    if (saved) {
        statistics = JSON.parse(saved);
    }
}

function saveGameHistory() {
    localStorage.setItem("morpionXHistory", JSON.stringify(gameHistory));
}

function loadGameHistory() {
    const saved = localStorage.getItem("morpionXHistory");
    if (saved) {
        gameHistory = JSON.parse(saved);
    }
}

function saveTournamentStats() {
    localStorage.setItem("morpionXTournament", JSON.stringify(tournamentStats));
}

function loadTournamentStats() {
    const saved = localStorage.getItem("morpionXTournament");
    if (saved) {
        tournamentStats = JSON.parse(saved);
    }
}

function loadGameData() {
    loadScores();
    loadStatistics();
    loadGameHistory();
    loadTournamentStats();
}

function updateStatsDisplay() {
    document.getElementById("totalGames").textContent = statistics.totalGames;
    document.getElementById("winsX").textContent = statistics.winsX;
    document.getElementById("winsO").textContent = statistics.winsO;
    document.getElementById("draws").textContent = statistics.draws;
    
    const total = statistics.totalGames;
    const winRateX = total > 0 ? ((statistics.winsX / total) * 100).toFixed(1) : 0;
    const winRateO = total > 0 ? ((statistics.winsO / total) * 100).toFixed(1) : 0;
    
    document.getElementById("winRateX").textContent = winRateX + "%";
    document.getElementById("winRateO").textContent = winRateO + "%";
    document.getElementById("winStreak").textContent = statistics.winStreak;
    document.getElementById("totalPlayTime").textContent = Math.floor(statistics.totalPlayTime) + " min";
}

function resetStatistics() {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser les statistiques ?")) {
        statistics = {
            totalGames: 0,
            winsX: 0,
            winsO: 0,
            draws: 0,
            winStreak: 0,
            currentStreak: 0,
            lastWinner: null,
            totalPlayTime: 0,
            gameStartTime: null
        };
        saveStatistics();
        updateStatsDisplay();
    }
}

function updateHistoryDisplay() {
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = "";
    
    if (gameHistory.length === 0) {
        historyList.innerHTML = "<p style='text-align: center; opacity: 0.7;'>Aucune partie enregistrée</p>";
        return;
    }
    
    gameHistory.forEach((game, index) => {
        const item = document.createElement("div");
        item.className = "history-item";
        if (game.winner === "draw") {
            item.classList.add("draw");
        } else if (game.winner === "O") {
            item.classList.add("winner-o");
        }
        
        const date = new Date(game.date);
        const dateStr = date.toLocaleDateString() + " " + date.toLocaleTimeString();
        const winnerText = game.winner === "draw" ? "Match Nul" : `Joueur ${game.winner} a gagné`;
        const duration = Math.floor(game.duration) + "s";
        
        item.innerHTML = `
            <div class="history-date">${dateStr}</div>
            <div><strong>${winnerText}</strong> - Grille ${game.gridSize}x${game.gridSize} - Durée: ${duration}</div>
        `;
        historyList.appendChild(item);
    });
}

function clearHistory() {
    if (confirm("Êtes-vous sûr de vouloir effacer l'historique ?")) {
        gameHistory = [];
        saveGameHistory();
        updateHistoryDisplay();
    }
}

function updateTournamentDisplay() {
    document.getElementById("tournamentGames").textContent = tournamentStats.games;
    document.getElementById("tournamentWinsX").textContent = tournamentStats.winsX;
    document.getElementById("tournamentWinsO").textContent = tournamentStats.winsO;
    document.getElementById("tournamentScore").textContent = `${tournamentStats.winsX} - ${tournamentStats.winsO}`;
}

function resetTournament() {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser le tournoi ?")) {
        tournamentStats = { games: 0, winsX: 0, winsO: 0 };
        saveTournamentStats();
        updateTournamentDisplay();
    }
}

// Mode multijoueur en ligne (WebSockets)
function createRoom() {
    roomId = generateRoomId();
    connectToServer(roomId, true);
    document.getElementById("roomIdInput").value = roomId;
    document.getElementById("onlineStatus").textContent = `Salle créée: ${roomId}`;
    document.getElementById("onlineStatus").classList.add("connected");
}

function joinRoom() {
    const inputRoomId = document.getElementById("roomIdInput").value.trim();
    if (!inputRoomId) {
        alert("Veuillez entrer un ID de salle");
        return;
    }
    roomId = inputRoomId;
    connectToServer(roomId, false);
}

function generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function connectToServer(room, isHost) {
    // Charger Socket.IO depuis CDN si disponible
    if (typeof io === 'undefined') {
        // Charger Socket.IO dynamiquement
        const script = document.createElement('script');
        script.src = 'https://cdn.socket.io/4.5.4/socket.io.min.js';
        script.onload = () => {
            initializeSocket(room, isHost);
        };
        document.head.appendChild(script);
    } else {
        initializeSocket(room, isHost);
    }
}

function initializeSocket(room, isHost) {
    const serverUrl = window.location.origin;
    socket = io(serverUrl);
    
    onlineMode = true;
    isOnlineHost = isHost;
    aiMode = false;
    aiModeBtn.disabled = true;
    onlineModeBtn.classList.add("active");
    document.getElementById("disconnectBtn").style.display = "block";
    
    socket.on('connect', () => {
        console.log('Connecté au serveur');
        if (isHost) {
            socket.emit('createRoom', room);
        } else {
            socket.emit('joinRoom', room);
        }
    });
    
    socket.on('roomCreated', (roomId) => {
        document.getElementById("onlineStatus").textContent = `Salle créée: ${roomId}. En attente d'un joueur...`;
        document.getElementById("onlineStatus").classList.add("connected");
    });
    
    socket.on('roomJoined', (roomId) => {
        document.getElementById("onlineStatus").textContent = `Connecté à la salle: ${roomId}`;
        document.getElementById("onlineStatus").classList.add("connected");
    });
    
    socket.on('gameStart', (data) => {
        document.getElementById("onlineStatus").textContent = `Partie en cours - ${data.players} joueur(s)`;
        resetGame();
    });
    
    socket.on('moveReceived', (data) => {
        if (!lock && game[data.index] === "") {
            playMove(data.index, data.player);
            soundSystem.playMove();
            // Après avoir reçu le coup de l'adversaire, c'est maintenant notre tour
            // On doit jouer le symbole opposé à ce qui vient d'être joué
            player = data.player === "X" ? "O" : "X";
            updateDisplay();
            updateScoreboard();
            verification(true);
        }
    });
    
    socket.on('gameRestart', () => {
        resetGame();
    });
    
    socket.on('playerLeft', () => {
        document.getElementById("onlineStatus").textContent = "L'adversaire a quitté la partie";
        document.getElementById("onlineStatus").classList.remove("connected");
    });
    
    socket.on('error', (error) => {
        alert('Erreur: ' + error);
        onlineMode = false;
        aiModeBtn.disabled = false;
    });
    
    socket.on('disconnect', () => {
        document.getElementById("onlineStatus").textContent = "Déconnecté";
        document.getElementById("onlineStatus").classList.remove("connected");
        onlineMode = false;
        aiModeBtn.disabled = false;
        onlineModeBtn.classList.remove("active");
        document.getElementById("disconnectBtn").style.display = "none";
    });
}

function disconnectFromRoom() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
    onlineMode = false;
    aiModeBtn.disabled = false;
    onlineModeBtn.classList.remove("active");
    document.getElementById("onlineStatus").textContent = "Déconnecté";
    document.getElementById("onlineStatus").classList.remove("connected");
    document.getElementById("disconnectBtn").style.display = "none";
    roomId = null;
    resetGame();
}

function sendMove(index) {
    // Envoyer le coup au serveur via Socket.IO
    if (socket && socket.connected) {
        socket.emit('move', {
            roomId: roomId,
            index: index,
            player: player
        });
    }
}

// Initialiser le temps de jeu
statistics.gameStartTime = Date.now();
