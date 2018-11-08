const numTiles = 9;
const rowTiles = 3; 
const humanPlayer = 'X';
const aiPlayer = 'O';
const cells = document.querySelectorAll('.cell');
const resultDiv = document.getElementById("result");
const resetButton = document.getElementById('reset');

let endGame = false;
let winList = [];
let board = [];

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
    board = [];
    resultDiv.style.display = "none";
    resetButton.style.display = "none";

    storeResults();
    
    for (let i = 0; i < numTiles; i++){
        board.push(i);
    }
    for (let i = 0; i < cells.length; i++){
        cells[i].style.removeProperty('background-color');
        cells[i].innerText = '';
        cells[i].addEventListener('click', makeMove);
    } 
}

function makeMove(cell){
    let availableSpots = board.filter(elem => (typeof elem) == 'number');
    const selectedCellId = cell.target.id;
    moveOfPlayer(availableSpots, selectedCellId, humanPlayer);
    if (!endGame){
        moveOfPlayer(availableSpots, availableSpots[0], aiPlayer);
    }
}

function moveOfPlayer(availableSpots, selectedCellId, player){
     // Check tie
    if (availableSpots.length == 0 && !endGame){
        resultDiv.innerText = "Tie game";
        endGame = true;
        gameOver();
    }else{
        const selectedCell = document.getElementById(selectedCellId);
        selectedCell.innerText = player;
        selectedCell.removeEventListener('click', makeMove);
        
        // Check if the player won
        isWon(player, selectedCellId);
    }
}

function isWon(player, selectedCellId){
    let announce;
    let color;
    let movesHistory = [];
    
    if (player == humanPlayer){
        board[parseInt(selectedCellId)] = "X";
        announce = "You won";
        color = "blue";
        for (let i = 0; i < board.length; i++){
            if(board[i] == "X"){
                movesHistory.push(i);
            }
        }
    }else{
        board[parseInt(selectedCellId)] = "O";
        announce = "You lose";
        color = "red";
        for (let i = 0; i < board.length; i++){
            if(board[i] == "O"){
                movesHistory.push(i);
            }
        }
    }
    console.log(movesHistory);
    for (let i = 0; i < winList.length; i++){
        endGame = winList[i].every(elem => movesHistory.includes(elem));
        if (endGame){
            for (let tileIndex of winList[i]){
                document.getElementById(tileIndex).style.backgroundColor = color;
            }
            resultDiv.innerText = announce;
            resultDiv.style.backgroundColor = color;
            gameOver();
            break;
        }   
    }
}

function minimax(player){

}

function gameOver(){
    for (let i = 0; i < cells.length; i++){
        //cells[i].style.backgroundColor = "yellow";
        cells[i].removeEventListener('click', makeMove);
    }
    resultDiv.style.display = "block";
    resetButton.style.display = "block";
}