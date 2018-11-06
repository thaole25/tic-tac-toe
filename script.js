const numTiles = 9;
const rowTiles = 3; 
const humanPlayer = 'X';
const aiPlayer = 'O';
const cells = document.querySelectorAll('.cell');
const resultDiv = document.getElementById("result");
const resetButton = document.getElementById('reset');

let endGame = false;
let winList = [];
let saveMoves = {}; // history moves of each player
let emptyTiles = [];

startGame();

// Create the results of winning
function storeResults(){
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
}

function startGame(){
    endGame = false;
    winList = [];
    saveMoves = {};
    emptyTiles = [];
    resultDiv.style.display = "none";
    resetButton.style.display = "none";

    storeResults();
    
    for (let i = 0; i < numTiles; i++){
        emptyTiles.push(i);
    }
    for (let i = 0; i < cells.length; i++){
        cells[i].style.removeProperty('background-color');
        cells[i].innerText = '';
        cells[i].addEventListener('click', makeMove);
    } 
}

function makeMove(cell){
    const selectedCellId = cell.target.id;
    moveOfPlayer(selectedCellId, humanPlayer);
    if (!endGame){
        moveOfPlayer(emptyTiles[0], aiPlayer);
    }
}

function moveOfPlayer(selectedCellId, player){
     // Check tie
    if (emptyTiles.length == 0 && !endGame){
        document.getElementById("result").innerText = "Tie game";
        endGame = true;
        gameOver();
    }else{
        const selectedCell = document.getElementById(selectedCellId);
        selectedCell.innerText = player;
        const idx = emptyTiles.indexOf(parseInt(selectedCellId));
        emptyTiles.splice(idx, 1);
        selectedCell.removeEventListener('click', makeMove);

        //Save history moves of player
        if (!saveMoves[player]){
            saveMoves[player] = [];
        }
        saveMoves[player].push(parseInt(selectedCellId));
    
        //Check if the player won
        for (let i = 0; i < winList.length; i++){
            endGame = winList[i].every(elem => saveMoves[player].includes(elem));
        
            // If the player won
            if (endGame){
                let color = player == humanPlayer ? "blue": "red";
                let announce = player == humanPlayer ? "You won": "You lose";
                for (let tileIndex of winList[i]){
                    document.getElementById(tileIndex).style.backgroundColor = color;
                }
                document.getElementById("result").innerText = announce;
                gameOver();
                break;
            }   
        }
    }
}

function gameOver(){
    for (let i = 0; i < cells.length; i++){
        //cells[i].style.backgroundColor = "yellow";
        cells[i].removeEventListener('click', makeMove);
    }
    resultDiv.style.display = "block";
    resetButton.style.display = "block";
}