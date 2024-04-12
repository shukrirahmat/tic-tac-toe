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
            return true;
        } else if (board[3] === mark && board[4] === mark && board[5] === mark) {
            return true;
        } else if (board[6] === mark && board[7] === mark && board[8] === mark) {
            return true;
        } else if (board[0] === mark && board[3] === mark && board[6] === mark) {
            return true;
        } else if (board[1] === mark && board[4] === mark && board[7] === mark) {
            return true;
        } else if (board[2] === mark && board[5] === mark && board[8] === mark) {
            return true;
        } else if (board[0] === mark && board[4] === mark && board[8] === mark) {
            return true;
        } else if (board[2] === mark && board[4] === mark && board[7] === mark) {
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

    /*
    const display = () => {
        console.log(board[0] + "  " + board[1] + "  " + board[2]);
        console.log(board[3] + "  " + board[4] + "  " + board[5]);
        console.log(board[6] + "  " + board[7] + "  " + board[8]);
    }
    */

    return { reset, getBoard, getSquare, setSquare, checkWinner, getTurn, advanceTurn};
}

function Player(name, mark) {

    const chooseSquare = (board, index) => {
        if (board.getSquare(index) === " ") {
            board.setSquare(index, mark);
            board.advanceTurn();
            display.updateBoard(board.getBoard());
        } 
    }

    return {name, mark, chooseSquare};
}

const display = (function() {

    const squares = document.querySelectorAll('.square');
    const footer = document.querySelector('.footer');

    const getSquareGrids = () => squares;
    const getFooter = () => footer;

    const updateBoard = (board) => {
        squares.forEach(
            function(node, index) {
                node.textContent = board[index];
            }
        );
    }; 

    return {updateBoard, getSquareGrids, getFooter};

})();

function Game() {

    const gameboard = Gameboard();
    const player1 = Player("one", "X");
    const player2 = Player("two", "O");



    const start = () => {
        
        gameboard.reset();
        display.updateBoard(gameboard);

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
    }

    const end = () => {
        let winner = gameboard.checkWinner();
        if (winner === 'draw') {
            display.getFooter().textContent = "It's a draw!";
        }  else {
            if (winner === player1.mark) {
                display.getFooter().textContent = player1.name + " wins!";
            } else {
                display.getFooter().textContent = player2.name + " wins!";
            }
        }       
    }

    return {start};

}

const game = Game();
game.start();