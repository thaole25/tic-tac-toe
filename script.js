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
    const selectedCellId = cell.target.id;
    moveOfPlayer(board, selectedCellId, humanPlayer);
    if (!endGame){
        let copyBoard = board;
        copyBoard = ['X', 1, 'O', 'O', 4, 'O', 6, 'X', 'X'];
        minimax(copyBoard, humanPlayer);
        //let bestAction = minimax(board, aiPlayer);
        //let availableSpots = board.filter(elem => (typeof elem) == 'number');
        //moveOfPlayer(board, availableSpots[0], aiPlayer);
    }
}

function moveOfPlayer(currentState, selectedCellId, player){
    // Check tie
    if (! isTie(currentState, false)){
        const selectedCell = document.getElementById(selectedCellId);
        selectedCell.innerText = player;
        selectedCell.removeEventListener('click', makeMove);
        
        // Fill the tile
        if (player == humanPlayer){
            currentState[parseInt(selectedCellId)] = humanPlayer;
        }else{
            currentState[parseInt(selectedCellId)] = aiPlayer;
        }

        // Check if the player won
        isWon(currentState, player, false);
    }
}

function isTie(currentState, simulateMode){
    let availableSpots = currentState.filter(elem => (typeof elem) == 'number');
    if ((availableSpots.length == 0)){
        if (!simulateMode && !endGame){
            resultDiv.innerText = "Tie game";
            endGame = true;
            gameOver();
        }
        return true;
    }else{
        return false;
    }
}

function isWon(currentState, player, simulateMode){
    let announce;
    let color;
    let movesHistory = [];
    
    if (player == humanPlayer){
        announce = "You won";
        color = "blue";
        for (let i = 0; i < currentState.length; i++){
            if(currentState[i] == humanPlayer){
                movesHistory.push(i);
            }
        }
    }else{
        announce = "You lose";
        color = "red";
        for (let i = 0; i < currentState.length; i++){
            if(currentState[i] == aiPlayer){
                movesHistory.push(i);
            }
        }
    }
    for (let i = 0; i < winList.length; i++){
        let check = winList[i].every(elem => movesHistory.includes(elem));
        
        if (check){
            if (!simulateMode){
                showResult(winList[i], announce, color);
                endGame = true;
            }
            return true;     
        }
    }
    return false;
}

function showResult(winList, announce, color){
    for (let tileIndex of winList){
        document.getElementById(tileIndex).style.backgroundColor = color;
    }
    resultDiv.innerText = announce;
    resultDiv.style.backgroundColor = color;
    gameOver();
}

class Node{
    constructor(state, player, parent, children = [], payoff = null){
        this.state = state; // the board
        this.player = player; // X or O, action that creates the state
        this.parent = parent;
        this.children = children;
        this.payoff = payoff;
    }
}

function minimax(currentState, player){
    // Generate the tree
    const startNode = new Node(currentState, player, null);
    tree(startNode);
    // print the tree
    //printTree(startNode);
}

let nextState;
let availableSpots;
let nextPlayer;
let nextNode;
let count = 0;

function tree(currentNode){
    count += 1;

    if (isWon(currentNode.state, currentNode.player, true)){
        if (currentNode.player == humanPlayer) currentNode.payoff = [-1,1];
        else currentNode.payoff = [1,-1];
        return;
    }else if (isTie(currentNode.state, true)){
        currentNode.payoff = [0,0];
        return;
    }
    
    nextState = currentNode.state.slice();
    availableSpots = currentNode.state.filter(elem => (typeof elem) == 'number');
    console.log(availableSpots);
    console.log(availableSpots.length);
    for (let i = 0; i < availableSpots.length; i++){
        nextPlayer = currentNode.player == humanPlayer ? 'O':'X';
        nextState[availableSpots[i]] = nextPlayer;
        nextNode = new Node(nextState, nextPlayer, currentNode);
        currentNode.children.push(nextNode);
        tree(nextNode);
    }
}

function printTree(currentNode){
    console.log(currentNode);
    for (i = 0; i < currentNode.children.length; i++){
        printTree(currentNode.children[i]);
    }
}

function gameOver(){
    for (let i = 0; i < cells.length; i++){
        cells[i].removeEventListener('click', makeMove);
    }
    resultDiv.style.display = "block";
    resetButton.style.display = "block";
}