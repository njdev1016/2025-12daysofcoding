// Queen data storage
let queens = [];
let conflicts = [];
let showAttackLines = false;

// DOM elements
const fileUpload = document.getElementById('file-upload');
const fileName = document.getElementById('file-name');
const chessboard = document.getElementById('chessboard');
const queenCount = document.getElementById('queen-count');
const conflictCount = document.getElementById('conflict-count');
const solutionStatus = document.getElementById('solution-status');
const toggleAttacks = document.getElementById('toggle-attacks');
const resetBtn = document.getElementById('reset');
const queenList = document.getElementById('queen-list');
const conflictList = document.getElementById('conflict-list');

// Initialize board
function initBoard() {
    chessboard.innerHTML = '';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            cell.className = `cell ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
            cell.dataset.row = row;
            cell.dataset.col = col;
            chessboard.appendChild(cell);
        }
    }
}

// File upload handler
fileUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    fileName.textContent = file.name;
    const reader = new FileReader();

    reader.onload = (event) => {
        const content = event.target.result;
        parseDataset(content);
    };

    reader.readAsText(file);
});

// Parse dataset file
function parseDataset(content) {
    queens = [];
    const lines = content.trim().split('\n');

    lines.forEach(line => {
        line = line.trim();
        if (!line) return;

        const [row, col] = line.split(',').map(num => parseInt(num.trim()));
        if (!isNaN(row) && !isNaN(col)) {
            queens.push({ row, col });
        }
    });

    analyzeQueens();
    renderQueens();
    updateStats();
    displayQueenList();
    displayConflictList();
}

// Check if two queens are attacking each other
function isAttacking(q1, q2) {
    // Same row
    if (q1.row === q2.row) return 'row';

    // Same column
    if (q1.col === q2.col) return 'column';

    // Same diagonal (↘)
    if (q1.row - q1.col === q2.row - q2.col) return 'diagonal';

    // Same anti-diagonal (↙)
    if (q1.row + q1.col === q2.row + q2.col) return 'anti-diagonal';

    return false;
}

// Analyze queens for conflicts
function analyzeQueens() {
    conflicts = [];

    for (let i = 0; i < queens.length; i++) {
        for (let j = i + 1; j < queens.length; j++) {
            const attackType = isAttacking(queens[i], queens[j]);
            if (attackType) {
                conflicts.push({
                    queen1: i,
                    queen2: j,
                    type: attackType,
                    pos1: queens[i],
                    pos2: queens[j]
                });
            }
        }
    }
}

// Render queens on board
function renderQueens() {
    initBoard();

    const cells = document.querySelectorAll('.cell');
    const conflictingCells = new Set();

    // Mark conflicting cells
    conflicts.forEach(conflict => {
        conflictingCells.add(`${conflict.pos1.row}-${conflict.pos1.col}`);
        conflictingCells.add(`${conflict.pos2.row}-${conflict.pos2.col}`);
    });

    // Place queens
    queens.forEach((queen, index) => {
        const cell = Array.from(cells).find(c =>
            c.dataset.row == queen.row && c.dataset.col == queen.col
        );

        if (cell) {
            const queenEl = document.createElement('span');
            queenEl.className = 'queen';
            queenEl.textContent = '♛';
            queenEl.title = `Queen ${index + 1} at (${queen.row}, ${queen.col})`;
            cell.appendChild(queenEl);
            cell.classList.add('has-queen');

            // Mark conflicts
            if (conflictingCells.has(`${queen.row}-${queen.col}`)) {
                cell.classList.add('conflict');
            }
        }
    });
}

// Update statistics
function updateStats() {
    queenCount.textContent = queens.length;
    conflictCount.textContent = conflicts.length;

    if (queens.length === 0) {
        solutionStatus.textContent = '-';
        solutionStatus.className = 'stat-value';
    } else if (conflicts.length === 0) {
        solutionStatus.textContent = '✓ VALID';
        solutionStatus.className = 'stat-value status-valid';
    } else {
        solutionStatus.textContent = '✗ INVALID';
        solutionStatus.className = 'stat-value status-invalid';
    }
}

// Display queen list
function displayQueenList() {
    if (queens.length === 0) {
        queenList.innerHTML = '';
        return;
    }

    let html = '<h3>Queen Positions</h3>';
    queens.forEach((queen, index) => {
        html += `
            <div class="queen-item">
                Queen ${index + 1}: Row ${queen.row}, Column ${queen.col} (${queen.row},${queen.col})
            </div>
        `;
    });
    queenList.innerHTML = html;
}

// Display conflict list
function displayConflictList() {
    if (conflicts.length === 0) {
        conflictList.innerHTML = '';
        return;
    }

    let html = '<h3>Conflicts Found</h3>';
    conflicts.forEach((conflict, index) => {
        const q1 = conflict.queen1 + 1;
        const q2 = conflict.queen2 + 1;
        html += `
            <div class="conflict-item">
                ${index + 1}. Queen ${q1} (${conflict.pos1.row},${conflict.pos1.col})
                attacks Queen ${q2} (${conflict.pos2.row},${conflict.pos2.col})
                - same ${conflict.type}
            </div>
        `;
    });
    conflictList.innerHTML = html;
}

// Toggle attack lines visualization
toggleAttacks.addEventListener('click', () => {
    showAttackLines = !showAttackLines;

    if (showAttackLines) {
        drawAttackLines();
        toggleAttacks.textContent = 'Hide Attack Lines';
    } else {
        clearAttackLines();
        toggleAttacks.textContent = 'Show Attack Lines';
    }
});

// Draw attack lines between conflicting queens
function drawAttackLines() {
    clearAttackLines();

    conflicts.forEach(conflict => {
        const cells = document.querySelectorAll('.cell');
        const cell1 = Array.from(cells).find(c =>
            c.dataset.row == conflict.pos1.row && c.dataset.col == conflict.pos1.col
        );
        const cell2 = Array.from(cells).find(c =>
            c.dataset.row == conflict.pos2.row && c.dataset.col == conflict.pos2.col
        );

        if (cell1 && cell2) {
            const rect1 = cell1.getBoundingClientRect();
            const rect2 = cell2.getBoundingClientRect();
            const boardRect = chessboard.getBoundingClientRect();

            const x1 = rect1.left + rect1.width / 2 - boardRect.left;
            const y1 = rect1.top + rect1.height / 2 - boardRect.top;
            const x2 = rect2.left + rect2.width / 2 - boardRect.left;
            const y2 = rect2.top + rect2.height / 2 - boardRect.top;

            const line = document.createElement('div');
            line.className = 'attack-line';

            const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
            const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

            line.style.width = `${length}px`;
            line.style.height = '3px';
            line.style.left = `${x1}px`;
            line.style.top = `${y1}px`;
            line.style.transform = `rotate(${angle}deg)`;

            chessboard.appendChild(line);
        }
    });
}

// Clear attack lines
function clearAttackLines() {
    const lines = document.querySelectorAll('.attack-line');
    lines.forEach(line => line.remove());
}

// Reset board
resetBtn.addEventListener('click', () => {
    queens = [];
    conflicts = [];
    initBoard();
    updateStats();
    queenList.innerHTML = '';
    conflictList.innerHTML = '';
    fileName.textContent = 'No file chosen';
    fileUpload.value = '';
    clearAttackLines();
    showAttackLines = false;
    toggleAttacks.textContent = 'Show Attack Lines';
});

// Initialize on load
initBoard();
updateStats();
