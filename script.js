let currentQueens = []; // Moved currentQueens to a higher scope
let moveCount = 0; // Track the number of moves
let validMoves = new Set(); // Keep track of valid squares for the current row

// Load CSV file and parse it
function loadSolutions(callback) {
    Papa.parse('8_queens_solutions.csv', {
        download: true,
        complete: function(results) {
            const solutions = results.data.map(row => row.map(Number));
            console.log("Solutions Loaded:", solutions); // Debugging: Check if solutions are loaded
            callback(solutions);
        }
    });
}

// Function to filter solutions based on the current board state
function filterSolutions(solutions, currentQueens) {
    return solutions.filter(solution => {
        for (let i = 0; i < currentQueens.length; i++) {
            if (currentQueens[i] !== -1 && currentQueens[i] !== solution[i]) {
                return false;
            }
        }
        return true;
    });
}

// Function to highlight valid moves based on filtered solutions
function highlightValidMoves(filteredSolutions, currentRow) {
    validMoves.clear(); // Reset valid moves set
    filteredSolutions.forEach(solution => validMoves.add(solution[currentRow]));

    clearHighlights();

    validMoves.forEach(col => {
        const square = document.querySelector(`#square-${currentRow}-${col}`);
        if (square) {
            square.classList.add('highlight');
        }
    });
}

// Clear all highlighted squares
function clearHighlights() {
    const highlightedSquares = document.querySelectorAll('.highlight');
    highlightedSquares.forEach(square => square.classList.remove('highlight'));
}

// Function to show a popup when user attempts an invalid move
function showPopup(message) {
    alert(message); // Simple alert for now, you can make it more styled if needed
}

// Initialize the AI-assisted board
function initializeBoard(solutions) {
    const n = 8;
    currentQueens = Array(n).fill(-1); // Reset queens' positions
    moveCount = 0; // Reset move count
    console.log("Initializing Board...");

    const chessboard = document.getElementById('chessboard');
    chessboard.innerHTML = ''; // Clear previous board content

    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            const square = document.createElement('div');
            square.id = `square-${row}-${col}`;
            square.className = `square ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
            square.addEventListener('click', function() {
                if (row !== moveCount) {
                    showPopup("You must place the queen in the first row initially, then proceed row by row.");
                    return;
                }

                if (!validMoves.has(col)) {
                    showPopup("You are choosing the wrong solution. Please place the queen in a highlighted square.");
                    return;
                }

                if (currentQueens[row] === col) {
                    currentQueens[row] = -1;
                    this.innerHTML = '';
                    clearHighlights();
                    const filteredSolutions = filterSolutions(solutions, currentQueens);
                    if (row + 1 < n) {
                        highlightValidMoves(filteredSolutions, row + 1);
                    }
                } else if (currentQueens[row] === -1) {
                    currentQueens[row] = col;
                    this.innerHTML = '<img src="queen_img.png" alt="Queen">';
                    const filteredSolutions = filterSolutions(solutions, currentQueens);
                    console.log("Filtered Solutions:", filteredSolutions);
                    if (row + 1 < n) {
                        moveCount++; // Increment move count after valid move
                        highlightValidMoves(filteredSolutions, row + 1);
                    } else {
                        clearHighlights();
                    }
                }

                if (row + 1 === n && checkWin(currentQueens)) {
                    document.getElementById('win-message').style.display = 'block';
                } else {
                    document.getElementById('win-message').style.display = 'none';
                }
            });
            chessboard.appendChild(square);
        }
    }

    highlightValidMoves(solutions, 0); // Start with the first row's valid moves
}

// Add functionality to reset the board
document.getElementById('reset-button').addEventListener('click', function() {
    loadSolutions(initializeBoard);
    document.getElementById('win-message').style.display = 'none';
});

// Start the board initialization
loadSolutions(initializeBoard);