export default function game() {
	const BOARD_SIZE = 10;

	const game = {
		boardSize: {
			linesAmount: BOARD_SIZE,
			collumnsAmount: BOARD_SIZE
		}
	}

	game.state = new Array(game.boardSize.linesAmount).fill(0);

	for (let line in game.state) {
		game.state[line] = new Array(game.boardSize.collumnsAmount).fill("empty");
	}

	game.snake = {
		tail: {
			line: 1,
			column: 1
		},
		head: {
			line: 2,
			column: 1
		},
		direction: "up"
	}

	game.move = function (direction) {
		const acceptedDirections = {
			up() {
				game.snake.head.line = - 1 + (game.snake.head.line - 1 < 0) ? (game.boardSize.linesAmount) : (game.snake.head.line);
			}
		}

		if(acceptedDirections[direction])
			acceptedDirections[direction]();
	}

	game.place = function () {
		game.state[game.snake.tail.line][game.snake.tail.column] = "empty";
		game.state[game.snake.head.line][game.snake.head.line] = "snake";
	}

	console.table(game.state);
}