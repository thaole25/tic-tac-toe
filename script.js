let board = [];
const numTiles = 9;
const rowTiles = 3; 
let saveMoves = {}; // history moves of each player

const humanPlayer = 'X';
const cells = document.querySelectorAll('.cell');

// Create the results of winning
let winList = [];
for (let i = 0; i < rowTiles; i++){
    let column = [];
    let maxValueColumn = i + (rowTiles - 1) * rowTiles;
    for (let j = i; j <= maxValueColumn; j += rowTiles){
        column.push(j);
    }
    winList.push(column);

    let row = [];
    let maxValueRow = i * rowTiles + (rowTiles - 1);
    for (let j = i*rowTiles; j <= maxValueRow; j++){
        row.push(j);
    }
    winList.push(row);
}

//Add 2 diagonal winning results
diagonal1 = [];
for (let j = 0; j < numTiles; j += (rowTiles + 1)){
    diagonal1.push(j);
}
winList.push(diagonal1);
diagonal2 = [];
for (let j = (rowTiles - 1); j < (numTiles - rowTiles + 1); j+= (rowTiles - 1)){
    diagonal2.push(j);
}
winList.push(diagonal2);
console.log(winList);

startGame();

function startGame(){
    for (let i = 0; i < numTiles; i++){
        board.push(i);
    }

    for (let i = 0; i < cells.length; i++){
        cells[i].innerText = '';
        cells[i].addEventListener('click', makeMove);
    } 
}

function makeMove(cell){
    const selectedCellId = cell.target.id;
    moveOfPlayer(selectedCellId, humanPlayer);
}

function moveOfPlayer(selectedCellId, player){
    const selectedCell = document.getElementById(selectedCellId);
    selectedCell.innerText = player;
    
    //Save history moves of player
    if (!saveMoves[player]){
        saveMoves[player] = [];
    }
    saveMoves[player].push(parseInt(selectedCellId));
    
    //Check if the player won
    let isWon = false;
    for (let i = 0; i < winList.length; i++){
        isWon = winList[i].every(elem => saveMoves[player].includes(elem));
        
        // If the player won
        if (isWon){
            //const resetButton = document.getElementById('reset');
            //resetButton.style.display = 
            
            for (let tileIndex of winList[i]){
                document.getElementById(tileIndex).style.backgroundColor = "red";   
            }

            for (let i = 0; i < numTiles; i++){
                cells[i].removeEventListener('click', makeMove);
            }
            break;
        }   
    }
    
    // winList.some(
    //     winElem => winElem.every(elem => saveMoves[player].includes(elem))
    // );
}