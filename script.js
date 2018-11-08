// Author: Thao Le

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
    //board = ['X', 1, 'O', 'O', 4, 'O', 6, 'X', 'X'];
    resultDiv.style.removeProperty('background-color');
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
        let copyBoard = board.slice();
        let bestAction = minimax(copyBoard, humanPlayer);
        //let availableSpots = board.filter(elem => (typeof elem) == 'number');
        moveOfPlayer(board, bestAction, aiPlayer);
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

function minimax(currentState, player){
    // Generate the tree
    let tree = [];
    const startNode = {"State": currentState, "Player": player, "Payoff": null, 
                       "PrevMove": null, "Children": []};
    tree.push(startNode);
    createTree(tree);

    // print the tree: BFS
    // printTree(tree);

    let bestAction = null;
    // TODO: Not really efficient, need to improve
    for (let child of startNode.Children){
        if (child.Payoff == startNode.Payoff){
            bestAction = child.PrevMove;
        }
    }
    return bestAction;
}

function createTree(tree){
    let currentNode = tree[tree.length - 1];
    if (isWon(currentNode.State, currentNode.Player, true)){
        if (currentNode.Player == humanPlayer) currentNode.Payoff = [-1,1];
        else currentNode.Payoff = [1,-1];
        return;
    }else if (isTie(currentNode.State, true)){
        currentNode.Payoff = [0,0];
        return;
    }
    let leftSpots = currentNode.State.filter(elem => (typeof elem) == 'number');
    let len = leftSpots.length;
    for (let i = 0; i < len; i++){
        let nextPlayer = currentNode.Player == humanPlayer ? 'O':'X';
        let nextState = currentNode.State.slice();
        nextState[leftSpots[i]] = nextPlayer;
        let nextNode = {"State": nextState, "Player": nextPlayer, "Payoff": null, 
                        "PrevMove": leftSpots[i], "Children": []};
        currentNode.Children.push(nextNode);
        tree.push(nextNode);
        createTree(tree);
    }
    let maxValue = -100;
    if (currentNode.Player == humanPlayer){
        // childNode will be aiPlayer
        for (let child of currentNode.Children){
            if (maxValue < child.Payoff[0]){
                maxValue = child.Payoff[0];
                currentNode.Payoff = child.Payoff;
            }
        }
    }else{
        for (let child of currentNode.Children){
            if (maxValue < child.Payoff[1]){
                maxValue = child.Payoff[1];
                currentNode.Payoff = child.Payoff;
            }
        }
    }
}

function printTree(tree){
    let queue = [tree[0]];
    while (queue.length > 0){
        let selectedNode = queue[0];
        console.log(selectedNode);
        queue.splice(0, 1);
        for (let child of selectedNode.Children){
            queue.push(child);
        }                                                                                                                                                                                                                                                                                       
    }
}

function gameOver(){
    for (let i = 0; i < cells.length; i++){
        cells[i].removeEventListener('click', makeMove);
    }
    resultDiv.style.display = "block";
    resetButton.style.display = "block";
}