function Gameboard() {

    let board = [];
    let turn = 0;

    const getBoard = () => board;

    const getSquare = (index) => board[index];

    const setSquare = (index, mark) => {
        board[index] = mark;
    }

    const getTurn = () => turn;

    const advanceTurn = () => turn++;

    /* Reset board to it's inital empty form, and return back to initial turn */
    const reset = () => {
        board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
        turn = 0;
    };

    /* Check if any mark lined up to make a win, and colors it */
    const checkWin = (mark) => {
        if (board[0] === mark && board[1] === mark && board[2] === mark) {
            display.addWinnerColor([0, 1, 2]);
            return true;
        } else if (board[3] === mark && board[4] === mark && board[5] === mark) {
            display.addWinnerColor([3, 4, 5]);
            return true;
        } else if (board[6] === mark && board[7] === mark && board[8] === mark) {
            display.addWinnerColor([6, 7, 8]);
            return true;
        } else if (board[0] === mark && board[3] === mark && board[6] === mark) {
            display.addWinnerColor([0, 3, 6]);
            return true;
        } else if (board[1] === mark && board[4] === mark && board[7] === mark) {
            display.addWinnerColor([1, 4, 7]);
            return true;
        } else if (board[2] === mark && board[5] === mark && board[8] === mark) {
            display.addWinnerColor([2, 5, 8]);
            return true;
        } else if (board[0] === mark && board[4] === mark && board[8] === mark) {
            display.addWinnerColor([0, 4, 8]);
            return true;
        } else if (board[2] === mark && board[4] === mark && board[6] === mark) {
            display.addWinnerColor([2, 4, 6]);
            return true;
        } else {
            return false;
        }
    }

    /* Check if any of two marks line ups to make a win, return draw if board are full */
    const checkWinner = () => {
        if (checkWin("X")) {
            return "X";
        } else if (checkWin("O")) {
            return "O";
        } else if (!board.includes(" ")) {
            return "draw";
        } else {
            return null;
        }
    }

    return { reset, getBoard, getSquare, setSquare, checkWinner, getTurn, advanceTurn};
}

function Player(name, mark) {

    const getMark = () => mark;
    const getName = () => name;
    const setName = (newName) => {
        name = newName;
    } 

    /*
    Adds player's mark on chosen square index, and update the display
    Only happens when the square is 'empty'
    */
    const chooseSquare = (board, index) => {
        if (board.getSquare(index) === " ") {
            board.setSquare(index, mark);
            display.addMarkColor(index, mark);
            display.updateBoard(board.getBoard());
            board.advanceTurn();
        } 
    }

    return {getName, setName, getMark, chooseSquare};
}

const display = (function() {

    const squares = document.querySelectorAll('.square');
    const footer = document.querySelector('.footer');
    const input1 = document.querySelector('#p1name');
    const input2 = document.querySelector('#p2name');

    const getSquareGrids = () => squares;
    const getFooter = () => footer;
    const getInput = (player) => {
        if (player === 1) {
            return input1
        } else return input2;
    }

    /* adds color class to the mark */
    const addMarkColor = (markIndex, mark) => {
        squares.forEach(
            function(node, index) {
                if (index === markIndex) {
                    if (mark === "X") {
                        node.classList.add('x');
                    } else {
                        node.classList.add('o');
                    }                   
                }
            }
        );
    }

    /* adds color class to the square that form winning line  */
    const addWinnerColor = (line) => {
        squares.forEach(
            function(node,index) {
                if (line.includes(index)) {
                   node.classList.add('winsq');
                }
            }
        )
    }

    /* updates the display of the board */
    const updateBoard = (board) => {
        squares.forEach(
            function(node, index) {
                node.textContent = board[index];
            }
        );
    }; 

    return {updateBoard, getSquareGrids, getFooter, addMarkColor, addWinnerColor, getInput};

})();

function Game() {

    /* create the key objects */
    const gameboard = Gameboard();
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");

    /* 
    add click event to the squares
    the event do nothing when there's a winner
    otherwise players add mark to the square (depend on the turn)
    ends the game when somebody wins, or draw
    otherwise, show whose move next
    */
    display.getSquareGrids().forEach(
        function(node, index) {
            node.addEventListener('click', function() {
                if (gameboard.checkWinner() !== null) {
                    //do nothing
                } else if (gameboard.getTurn() % 2 === 0) {
                    player1.chooseSquare(gameboard, index);
                } else {
                    player2.chooseSquare(gameboard, index);
                };

                if (gameboard.checkWinner() !== null) {
                    end();
                } else {
                    turnIndicator();
                }

            })
        }
    );

    /* adds live update on the text input for changing player name */ 
    display.getInput(1).addEventListener('input', function() {
        changeName(player1, this);
    })
    display.getInput(2).addEventListener('input', function() {
        changeName(player2, this);
    })

    /* changes the player name */
    function changeName(player, node) {
        player.setName(node.value);
        if (gameboard.checkWinner() === null) {
            turnIndicator();
        }
    }

    /* display whose turn next */
    const turnIndicator = () => {
        if (gameboard.getTurn() % 2 === 0) {
            display.getFooter().textContent = player1.getName() + "'s turn";
        } else {
            display.getFooter().textContent = player2.getName() + "'s turn";
        }
    }

    /*
    Start the game, also called when player restarts the game
    Advance 1 turn beforehand if 2nd player want to start first
    Clear up state-changing css classes
    */
    const start = (firstturn) => {
        gameboard.reset();
        if (firstturn === 1) { gameboard.advanceTurn()}

        display.getSquareGrids().forEach(
            function(node) {
                node.classList.remove('x');
                node.classList.remove('o');
                node.classList.remove('winsq');
            }
        );
        display.updateBoard(gameboard);
        turnIndicator();
    }

    /* 
    Display winner at the bottom
    then allows restart
    */
    const end = () => {
        let winner = gameboard.checkWinner();
        if (winner === 'draw') {
            display.getFooter().textContent = "It's a draw!";
        }  else {
            if (winner === player1.getMark()) {
                display.getFooter().textContent = player1.getName() + " wins!";
            } else {
                display.getFooter().textContent = player2.getName() + " wins!";
            }
        }
        showRestart();    
    }

    /*
    shows restart button
    each buttons represent the player who start first in the next game
    */
    const showRestart = () => {
        const restartdiv = document.createElement('p');
        restartdiv.textContent = "REPLAY?"
        const restart1 = document.createElement('button');
        const restart2 = document.createElement('button');
        restart1.textContent = "X Start";
        restart1.classList.add("r1");
        restart2.textContent = "O Start";
        restart2.classList.add("r2");
        restart1.addEventListener('click', function() {
            start(0);
        });
        restart2.addEventListener('click', function() {
            start(1);
        });
        restartdiv.appendChild(restart1);
        restartdiv.appendChild(restart2);
        display.getFooter().appendChild(restartdiv);
    }

    return {start};

}

const game = Game();
game.start(0);