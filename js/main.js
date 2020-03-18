'use strict'

// Const & Globals:

const MINE = '💣';
const TILE = '⬛️';
const FLAG = '📍';
var gBoard;
var gSize = 4;
var gNumOfMines = 2;
var gIsOn = true;

// Functions:

function initGame() {
    console.log('Lets play!');
    gBoard = buildBoard(gSize, gNumOfMines);
    renderBoard(gBoard);
}

function changeLevel(size, numOfMines) {
    gSize = size;
    gNumOfMines = numOfMines;
    initGame();
}

function buildBoard(size, numOfMines) {
    //debugger
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            var cell = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false }
            board[i][j] = cell;
            // place mines
            //if (i === 1 && j === 1) cell.isMine = true;
            //if (i === 3 && j === 2) cell.isMine = true;
        }
    }

    randomMineSet(numOfMines, board);
    // board[0][0].isMine = true;
    // board[3][2].isMine = true;
    setMinesNegsCount(board);
    console.table(board);
    return board;

}


function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j];

            strHTML += `\t<td class="unturned" onclick="cellClicked(this ,${i}, ${j})" onmousedown="cellMarked(event ,${i}, ${j})">`;
            //currCell.isMine ? strHTML += MINE : strHTML += '';
            if (!currCell.isShown) strHTML += TILE;
            if (currCell.isMarked) strHTML += FLAG;
            if (currCell.isMine && currCell.isShown) strHTML += MINE;

            if (currCell.minesAroundCount > 0 && currCell.isShown === true) {
                strHTML += currCell.minesAroundCount;
            }
            strHTML += '\t</td>\n';
        }
        strHTML += '</tr>\n';
    }

    console.log('strHTML is:');
    console.log(strHTML);
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
    checkGameOver(board);
}

function setMinesNegsCount(board) {
    //debugger
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var currCell = board[i][j];


            if (currCell.isMine === true) {
                var cellI = i;
                var cellJ = j;
                for (var x = cellI - 1; x <= cellI + 1; x++) {
                    if (x < 0 || x >= board.length) continue;
                    for (var y = cellJ - 1; y <= cellJ + 1; y++) {
                        var neighbor = board[x][y];
                        if (y < 0 || y >= board[i].length) continue;
                        if (x === cellI && y === cellJ) continue;
                        if (neighbor.isMine === true) continue;
                        neighbor.minesAroundCount++;
                    }
                }

            }
        }

    }
}


function cellClicked(elCell, cellI, cellJ) {
    gBoard[cellI][cellJ].isShown = true;
    renderBoard();

}


function randomMineSet(num, board) {
    //debugger
    for (var z = 0; z < num; z++) {
        var i = getRandomInt(0, board.length);
        var j = getRandomInt(0, board.length);
        board[i][j].isMine = true;
    }
}

function cellMarked(event, cellI, cellJ) {
    var click = event;
    if (click.button === 2) {
        gBoard[cellI][cellJ].isMarked = true;
        renderBoard();
    } else {
        return;
    }

}

function checkGameOver(board) {
    var allClear = false;
    var allMarked = false;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isMine === true && currCell.isShown === true) {
                console.log('You lost');
                gIsOn = false;
              
            }

            if (currCell.isMine === false && currCell.isShown === true) allClear = true;
            if (currCell.isMine === true && currCell.isMarked === true) allMarked = true;
            if (allClear && allMarked) {
                console.log('Awesome!! you have won!!');
                gIsOn = false;
                
            }
                

        }
    }
}
