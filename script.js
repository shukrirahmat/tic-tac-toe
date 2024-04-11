function Gameboard() {

    let board = [];

    const reset = () => {
        board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    };

    const getBoard = () => board;

    const getSquare = (index) => board[index];

    const setSquare = (index, mark) => {
        board[index] = mark;
    }

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

    const display = () => {
        console.log(board[0] + "  " + board[1] + "  " + board[2]);
        console.log(board[3] + "  " + board[4] + "  " + board[5]);
        console.log(board[6] + "  " + board[7] + "  " + board[8]);
    }

    return { reset, getBoard, getSquare, setSquare, checkWinner, display};
}

function Player(name, mark) {

    const chooseSquare = () => {
        return prompt(mark + " enter square");
    }

    return {name, mark, chooseSquare};
}

function Game() {

    const gameboard = Gameboard();
    const player1 = Player("one", "X");
    const player2 = Player("two", "O");
    let turn = 0;

    const runTurn = (turnPlayer) => {
        while (true) {
            let squareIndex = turnPlayer.chooseSquare();
            if (gameboard.getSquare(squareIndex) === " " ) {
                gameboard.setSquare(squareIndex, turnPlayer.mark);
                break;
            } else {
                console.log("square taken");
            }
        }
    }

    const run = () => {
        
        gameboard.reset();
        turn = 0;

        while (gameboard.checkWinner() == null) {
            if (turn % 2 == 0) {
                runTurn(player1);
            } else {
                runTurn(player2)
            }
            gameboard.display();
            turn++;
        }
        const winner = gameboard.checkWinner();
        if (winner === "draw") {
            console.log("it's a draw");
        } else {
            if (player1.mark === winner) {
                console.log(player1.name + " wins");
            } else {
                console.log(player2.name + " wins");
            }
        }
    }

    return {run};

}

const game = Game();

game.run();