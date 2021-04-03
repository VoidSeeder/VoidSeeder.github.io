//10x20

import getPiecesWithEmpty from "./pieces.js";

export default function newGame() {
	const observers = [];

	function subscribe(observerFunction) {
		observers.push(observerFunction);
	}

	function notifyAll(command) {
		for (let observerFunction of observers) {
			observerFunction(command);
		}
	}

	const boardSize = {
		linesAmount: 20,
		collumnsAmount: 10
	}

	const game = {
		score: 0,
		donwSpeedMS: 500,
		level: 1,
		nextPiece: null,
		holdedPiece: null
	}

	game.state = new Array(boardSize.linesAmount);

	for (let line = 0; line < boardSize.linesAmount; line++) {
		game.state[line] = new Array(boardSize.collumnsAmount);
		game.state[line].fill('empty');
	}

	const initialPosition = {
		line: 0,
		collumn: 4
	}

	function tranpose(matrix) {
		let newMatrix = new Array(matrix[0].length);

		for (let line in matrix[0]) {
			newMatrix[line] = new Array(matrix.length);
		}

		for (let line in matrix) {
			for (let collumn in matrix[line]) {
				newMatrix[collumn][line] = matrix[line][collumn];
			}
		}

		return newMatrix;
	}

	function genericRotate(matrix) {
		let newMatrix = new Array(matrix[0].length);

		for (let line in matrix[0]) {
			newMatrix[line] = new Array(matrix.length);
		}

		for (let line in matrix) {
			for (let collumn in matrix[line]) {
				newMatrix[collumn][line] = matrix[matrix.length - 1 - line][collumn];
			}
		}

		return newMatrix;
	}

	function genericVerifyNextStep(gameObj, shape, position) {
		for (let line in shape) {
			for (let collumn in shape[line]) {
				if (position.line + Number(line) < 0 || position.line + Number(line) > boardSize.linesAmount - 1) {
					return false;
				}

				if (position.collumn + Number(collumn) < 0 || position.collumn + Number(collumn) > boardSize.collumnsAmount - 1) {
					return false;
				}

				let positionToAnalaise = gameObj[position.line + Number(line)][position.collumn + Number(collumn)];

				if (shape[line][collumn] == 1 && positionToAnalaise != 'empty') {
					return false;
				}
			}
		}

		return true;
	}

	function removeLine(gameObj, lineNumber) {
		for (let line = lineNumber; line > 0; line--) {
			gameObj[line] = [].concat(gameObj[Number(line) - 1]);
		}

		gameObj[0].fill('empty');
	}

	function getTurnScore(gameObj) {
		let scoreTypes = [0, 40, 100, 300, 1200];
		let linesRemoved = 0;

		for (let line in gameObj) {
			if (!gameObj[line].includes('empty')) {
				linesRemoved += 1;
				removeLine(gameObj, line);
			}
		}

		return scoreTypes[linesRemoved];
	}

	function Piece(name, shape) {
		this.name = name;
		this.shape = shape;
		this.position = {
			line: initialPosition.line,
			collumn: initialPosition.collumn + 1 - Math.floor(this.shape[0].length / 2)
		}
		this.place = function (gameObj) {
			for (let line in this.shape) {
				for (let collumn in this.shape[line]) {
					if (this.shape[line][collumn] == 1) {
						gameObj[this.position.line + Number(line)][this.position.collumn + Number(collumn)] = this.name;
					}
				}
			}
		}
		this.remove = function (gameObj) {
			for (let line in this.shape) {
				for (let collumn in this.shape[line]) {
					if (this.shape[line][collumn] == 1) {
						gameObj[this.position.line + Number(line)][this.position.collumn + Number(collumn)] = 'empty';
					}
				}
			}
		}
		this.move = function (direction) {
			const acceptedMoves = {
				right(pieceObj) {
					pieceObj.position.collumn += 1;
				},
				left(pieceObj) {
					pieceObj.position.collumn -= 1;
				},
				down(pieceObj) {
					pieceObj.position.line += 1;
				}
			}

			if (acceptedMoves[direction]) {
				acceptedMoves[direction](this);
			}
		}
		this.rotate = function () {
			this.shape = genericRotate(this.shape);
		}
		this.canMove = function (gameObj, direction) {
			const movesToTry = {
				right(pieceObj) {
					return genericVerifyNextStep(gameObj, pieceObj.shape, {
						line: pieceObj.position.line,
						collumn: pieceObj.position.collumn + 1
					});
				},
				left(pieceObj) {
					return genericVerifyNextStep(gameObj, pieceObj.shape, {
						line: pieceObj.position.line,
						collumn: pieceObj.position.collumn - 1
					});
				},
				down(pieceObj) {
					return genericVerifyNextStep(gameObj, pieceObj.shape, {
						line: pieceObj.position.line + 1,
						collumn: pieceObj.position.collumn
					});
				}
			}

			if (movesToTry[direction]) {
				return movesToTry[direction](this);
			}

			return false;
		}
		this.canRotate = function (gameObj) {
			for (let width in this.shape) {
				if (this.position.collumn - Number(width) < 0) {
					return { answer: false };
				}
				if (genericVerifyNextStep(gameObj, genericRotate(this.shape), { line: this.position.line, collumn: this.position.collumn - Number(width) })) {
					return { answer: true, move: Number(width) };
				}
			}

			return { answer: false };
		}
	}

	const piecesArray = getPiecesWithEmpty(false);

	let activatedPiece = generateNewPiece();
	game.nextPiece = generateNewPiece();

	function generateNewPiece() {
		let pieceNumber = Math.floor(Math.random() * piecesArray.length);
		return new Piece(piecesArray[pieceNumber].name, piecesArray[pieceNumber].shape);
	}

	setInterval(() => {
		activatedPiece.remove(game.state);

		if (activatedPiece.canMove(game.state, 'down')) {
			activatedPiece.move('down');
		} else {
			activatedPiece.place(game.state);
			game.score += getTurnScore(game.state);
			activatedPiece = game.nextPiece;
			game.nextPiece = generateNewPiece();
		}

		activatedPiece.place(game.state);

		notifyAll(game);
	}, game.donwSpeedMS);

	function getInput(command) {
		activatedPiece.remove(game.state);

		if (activatedPiece.canMove(game.state, command)) {
			activatedPiece.move(command);
			activatedPiece.place(game.state);

			return notifyAll(game);
		}

		if (command == 'rotate') {
			if (activatedPiece.canRotate(game.state).answer) {
				for(let counter = activatedPiece.canRotate(game.state).move; counter > 0; counter--) {
					activatedPiece.move('left');
				}
				activatedPiece.rotate();
			}

			activatedPiece.place(game.state);

			return notifyAll(game);
		}

		return activatedPiece.place(game.state);
	}

	return {
		subscribe,
		getInput
	}
}