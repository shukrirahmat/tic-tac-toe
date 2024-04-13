function Gameboard() {

    let board = [];
    let turn = 0;

    const reset = () => {
        board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
        turn = 0;
    };

    const getBoard = () => board;

    const getSquare = (index) => board[index];

    const setSquare = (index, mark) => {
        board[index] = mark;
    }

    const getTurn = () => turn;
    const advanceTurn = () => turn++;

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

    const chooseSquare = (board, index) => {
        if (board.getSquare(index) === " ") {
            board.setSquare(index, mark);
            display.addMarkColor(index, mark);
            display.updateBoard(board.getBoard());
            board.advanceTurn();
        } 
    }

    const getMark = () => mark;
    const getName = () => name;
    const setName = (newName) => {
        name = newName;
    } 

    return {getName, setName, getMark, chooseSquare};
}

const display = (function() {

    const squares = document.querySelectorAll('.square');
    const footer = document.querySelector('.footer');

    const getSquareGrids = () => squares;
    const getFooter = () => footer;

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

    const addWinnerColor = (line) => {
        squares.forEach(
            function(node,index) {
                if (line.includes(index)) {
                   node.classList.add('winsq');
                }
            }
        )
    }

    const updateBoard = (board) => {
        squares.forEach(
            function(node, index) {
                node.textContent = board[index];
            }
        );
    }; 

    return {updateBoard, getSquareGrids, getFooter, addMarkColor, addWinnerColor};

})();

function Game() {

    const gameboard = Gameboard();
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");

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
                }

            })
        }
    );

    const start = () => {
        
        gameboard.reset();
        display.updateBoard(gameboard);
    }

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
    }

    return {start};

}

const game = Game();
game.start();