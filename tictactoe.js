const board = document.getElementById("board");
let cells = [];
let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];

function createBoard() {
    board.innerHTML = ""; // Clear board
    gameBoard.forEach((_, index) => {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = index; // Store index for reference
        cell.addEventListener("click", handleClick);
        board.appendChild(cell);
        cells.push(cell);
    });
}

let selectedDifficulty = "easy"; // Default

function setDifficulty(level) {
    selectedDifficulty = level;
    document.getElementById("easyBtn").classList.toggle("active", level === "easy");
    document.getElementById("hardBtn").classList.toggle("active", level === "hard");
    
    console.log("Difficulty set to:", selectedDifficulty); // Debugging output
}

function handleClick(event) {
    let index = event.target.dataset.index;
    if (!gameBoard[index]) {
        gameBoard[index] = currentPlayer;
        event.target.textContent = currentPlayer;
        event.target.classList.add("taken");

        let winner = checkWinner();
        if (winner) {
            updateScore(winner);
            setTimeout(() => showPopup(winner + " Wins!"), 100);
            return;  // Don't reset automatically
        }
        if (!gameBoard.includes("")) {
            updateScore("draw");
            setTimeout(() => showPopup("It's a Draw!"), 100);
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X"; // Switch player

        if (currentPlayer === "O") {
            setTimeout(aiMove, 500);
        }
    }
}

function aiMove() {
    let emptyCells = gameBoard.map((val, index) => (val === "" ? index : null)).filter(val => val !== null);

    let aiIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)]; // Pick random cell
    gameBoard[aiIndex] = currentPlayer;
    cells[aiIndex].textContent = currentPlayer;
    cells[aiIndex].classList.add("taken");

    if (checkWinner()) {
        updateScore(currentPlayer);
        setTimeout(() => showPopup(currentPlayer + " Wins!"), 100);
        resetGame();
        return;
    }
    if (!gameBoard.includes("")) {
        updateScore("draw");
        setTimeout(() => showPopup("It's a Draw!"), 100);
        resetGame();
        return;
    }

    currentPlayer = "X"; // Switch back to player
}

function minimax(newBoard, player) {
    let emptyCells = newBoard.map((val, index) => (val === "" ? index : null)).filter(val => val !== null);

    let winner = checkWinner(newBoard);
    if (winner === "O") return { score: 10 };
    if (winner === "X") return { score: -10 };
    if (emptyCells.length === 0) return { score: 0 };

    let moves = [];
    for (let i of emptyCells) {
        let move = { index: i };
        newBoard[i] = player;

        let result = minimax(newBoard, player === "O" ? "X" : "O");
        move.score = result.score;

        newBoard[i] = "";  
        moves.push(move);
    }

    let bestMove = null;
    if (player === "O") {
        let bestScore = -Infinity;
        for (let move of moves) {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let move of moves) {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }

    return bestMove !== null ? bestMove : { index: emptyCells[0], score: 0 };
}

function aiMove() {
    let aiIndex;

    if (selectedDifficulty === "easy") {
        let emptyCells = gameBoard.map((val, index) => (val === "" ? index : null)).filter(val => val !== null);
        aiIndex = emptyCells.length > 0 ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : undefined;
    } else {
        let bestMove = minimax([...gameBoard], "O");
        aiIndex = bestMove ? bestMove.index : undefined;
    }

    if (aiIndex === undefined || gameBoard[aiIndex] !== "") return;  

    gameBoard[aiIndex] = "O";
    
    if (cells[aiIndex]) {
        cells[aiIndex].style.opacity = "0"; // Start invisible
        setTimeout(() => {
            cells[aiIndex].textContent = "O";
            cells[aiIndex].classList.add("taken");
            cells[aiIndex].style.opacity = "1"; // Fade-in effect
        }, 200);
    }

    if (checkWinner()) {
        updateScore("O");
        setTimeout(() => showPopup("O Wins!"), 100);
        resetGame();
        return;
    }
    if (!gameBoard.includes("")) {
        updateScore("draw");
        setTimeout(() => showPopup("It's a Draw!"), 100);
        resetGame();
        return;
    }

    currentPlayer = "X";
}

function checkWinner(board = gameBoard) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]
    ];
    
    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];  
        }
    }
    return null;
}

let score = { X: 0, O: 0};

function updateScore(winner) {
    if (winner === "X") score.X++;
    else if (winner === "O") score.O++;

    // Get the correct scoreboard elements
    let playerScoreElement = document.getElementById("player-score");
    let aiScoreElement = document.getElementById("ai-score");

    if (playerScoreElement && aiScoreElement) {
        playerScoreElement.textContent = score.X;
        aiScoreElement.textContent = score.O;
    }
}

function resetGame() {
    createBoard(); // Regenerate board and reset cells reference
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    
    if (currentPlayer === "O") {
        setTimeout(aiMove, 500); // AI makes the first move
    }
}

function createBoard() {
    board.innerHTML = ""; // Clear board
    cells = []; // Clear cell references
    gameBoard.forEach((_, index) => {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = index;
        cell.addEventListener("click", handleClick);
        board.appendChild(cell);
        cells.push(cell);
    });
}

function aiStarts() {
    return selectedDifficulty === "hard" && currentPlayer === "O";
}

function setFirstPlayer(player) {
    currentPlayer = player;
    resetGame(); // Calls the updated resetGame() that now properly triggers AI
}

function showPopup(message) {
    if (!message) return; // Prevents empty popups
    document.getElementById("popupMessage").textContent = message;
    document.getElementById("gamePopup").style.display = "flex";
}

function closePopup() {
    document.getElementById("gamePopup").style.display = "none";
    resetGame(); // Reset the game when popup closes
}

// Function to handle selection
function selectButton(group, clickedButton) {
    // Remove 'selected' from all buttons in the group
    document.querySelectorAll("." + group).forEach(button => {
        button.classList.remove("selected");
    });

    // Add 'selected' class to the clicked button
    clickedButton.classList.add("selected");
}

// Attach event listeners to buttons
document.querySelectorAll(".difficulty").forEach(button => {
    button.addEventListener("click", function() {
        selectButton("difficulty", this);
    });
});

document.querySelectorAll(".turn").forEach(button => {
    button.addEventListener("click", function() {
        selectButton("turn", this);
    });
});


createBoard();
