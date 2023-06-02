const displayController = (() => {
    const renderMessage = (text) => {
        let textDiv = document.querySelector("#message");
        textDiv.textContent = `${text}`;
    }

    return {
        renderMessage,
    }
})();

const gameBoard = (() => {
    const GameBoard = ["", "", "", "", "", "", "", "", ""];

    const render = () => {
        let board = document.querySelector(".board");
        board.innerHTML = "";

        GameBoard.forEach((mark, index) => {
            let div = document.createElement("div");
            div.classList.add("square");
            div.setAttribute("id", `s${index}`);
            div.textContent = mark;
            div.addEventListener("click", Game.handleClick);
            board.appendChild(div);
        })
    }

    const update = (index, mark) => {
        GameBoard[index] = mark;
        render();
    }

    const returnBoard = () => {
        return GameBoard;
    }

    return {
        render,
        update,
        returnBoard,
    }
})();

const createPlayer = (name, mark) => {
    return {
        name,
        mark,
    }
}


const Game = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver;

    const start = () => {
        players = [
            createPlayer(document.querySelector("#player1").value, "X"),
            createPlayer(document.querySelector("#player2").value, "O"),
        ]
        currentPlayerIndex = 0;
        gameOver = false;
        gameBoard.render();
    }


    const handleClick = (event) => {
        if(gameOver == true) {
            return;
        }
        let square = parseInt(event.target.id.split("")[1]);
        if(gameBoard.returnBoard()[square] !== "") {
            return;
        }

        gameBoard.update(square, players[currentPlayerIndex].mark);

        if(checkForWin(gameBoard.returnBoard())) {
            gameOver = true;
            displayController.renderMessage(`${players[currentPlayerIndex].name} won!`);
        } else if(checkForTie(gameBoard.returnBoard())) {
            gameOver = true;
            displayController.renderMessage(`It's a tie`);
        }

        currentPlayerIndex = currentPlayerIndex == 0 ? 1 : 0;
    }


    const checkForWin = (board) => {
        const winningCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ]
    
        for(let i=0; i<winningCombos.length; i++) {
            const [a,b,c] = winningCombos[i];
            if(board[a] && board[a] == board[b] && board[a] == board[c]) {
                return true;
            }
        }
        return false;
    }

    const checkForTie = (board) => {
        return board.every((cell) => cell !== "");
    }


    const restart = () => {
        for(let i=0; i<9; i++) {
            gameBoard.update(i, "");
        }
        displayController.renderMessage("");
    }

    return {
        start,
        handleClick,
        restart,
    }
})();

const startButton = document.querySelector("#startButton");
startButton.addEventListener("click", () => {
    Game.restart()
    Game.start();
})