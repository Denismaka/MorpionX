// État du jeu
let player = "X";
let game = ["", "", "", "", "", "", "", "", ""];
let lock = false;
let aiMode = false;
let scores = {
    X: 0,
    O: 0
};

// Éléments DOM
const info = document.querySelector(".resultat");
const cells = document.querySelectorAll(".case");
const restartBtn = document.getElementById("restartBtn");
const aiModeBtn = document.getElementById("aiModeBtn");
const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");

// Charger les scores depuis le localStorage
loadScores();

// Combinaisons gagnantes
const combinaisonsGagnantes = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// Initialisation
initGame();

function initGame() {
    updateDisplay();
    cells.forEach((cell) => {
        cell.addEventListener("click", handleClick);
        cell.classList.remove("filled", "winning", "x", "o");
        cell.textContent = "";
    });
    
    restartBtn.addEventListener("click", resetGame);
    aiModeBtn.addEventListener("click", toggleAIMode);
    
    updateScoreboard();
}

function handleClick(e) {
    const currentClick = e.target;
    const caseIndex = parseInt(currentClick.getAttribute("data-index"));

    if (game[caseIndex] !== "" || lock) {
        return;
    }

    // Jouer le coup
    playMove(caseIndex, player);

    // Vérifier si le jeu est terminé
    if (!lock) {
        verification();
        
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

function verification() {
    let winningCombo = null;
    
    // Vérifier les combinaisons gagnantes
    for (let i = 0; i < combinaisonsGagnantes.length; i++) {
        const combinationsCheck = combinaisonsGagnantes[i];
        const a = game[combinationsCheck[0]];
        const b = game[combinationsCheck[1]];
        const c = game[combinationsCheck[2]];

        if (a === "" || b === "" || c === "") {
            continue;
        } else if (a === b && b === c) {
            winningCombo = combinationsCheck;
            lock = true;
            
            // Mettre en évidence la ligne gagnante
            highlightWinningCells(winningCombo);
            
            // Mettre à jour le score
            scores[player]++;
            saveScores();
            updateScoreboard();
            
            // Afficher le message de victoire
            info.textContent = `🎉 Le joueur ${player} a gagné !`;
            info.classList.add("winner");
            return;
        }
    }

    // Match nul
    if (!game.includes("")) {
        lock = true;
        info.textContent = "🤝 Match Nul !";
        info.classList.add("draw");
        return;
    }

    // Continuer le jeu
    switchPlayer();
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
    game = ["", "", "", "", "", "", "", "", ""];
    player = "X";
    lock = false;
    
    cells.forEach((cell) => {
        cell.textContent = "";
        cell.classList.remove("filled", "winning", "x", "o");
    });
    
    updateDisplay();
    updateScoreboard();
}

function toggleAIMode() {
    aiMode = !aiMode;
    aiModeBtn.classList.toggle("active", aiMode);
    aiModeBtn.textContent = aiMode ? "👥 Mode Multijoueur" : "🤖 Mode Solo";
    
    if (aiMode) {
        info.textContent = "Mode Solo activé - Vous jouez X";
    }
    
    resetGame();
}

function playAIMove() {
    if (lock) return;
    
    // Algorithme Minimax pour l'IA
    const bestMove = getBestMove();
    if (bestMove !== -1) {
        playMove(bestMove, "O");
        verification();
    }
}

function getBestMove() {
    // Si le centre est libre, le prendre
    if (game[4] === "") return 4;
    
    // Essayer de gagner
    for (let i = 0; i < combinaisonsGagnantes.length; i++) {
        const combo = combinaisonsGagnantes[i];
        const [a, b, c] = combo;
        const values = [game[a], game[b], game[c]];
        const oCount = values.filter(v => v === "O").length;
        const xCount = values.filter(v => v === "X").length;
        
        // Bloquer le joueur s'il peut gagner
        if (xCount === 2 && oCount === 0) {
            for (let j = 0; j < 3; j++) {
                if (game[combo[j]] === "") return combo[j];
            }
        }
        
        // Gagner si possible
        if (oCount === 2 && xCount === 0) {
            for (let j = 0; j < 3; j++) {
                if (game[combo[j]] === "") return combo[j];
            }
        }
    }
    
    // Prendre un coin libre
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => game[i] === "");
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    // Prendre n'importe quelle case libre
    const availableMoves = game.map((cell, index) => cell === "" ? index : -1).filter(i => i !== -1);
    if (availableMoves.length > 0) {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    return -1;
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
