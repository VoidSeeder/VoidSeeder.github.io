//10x20

import mapping from "./mapping.js";
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
		donwSpeedMS: {
			current: 1000,
			max: 1000,
			min: 50
		},
		level: {
			current: 1,
			min: 1,
			max: 30
		},
		linesCounter: 0,
		activatedPiece: null,
		nextPiece: null,
		canHold: true,
		holdedPiece: null,
		intervalID: null,
		menu: {
			isActive: false,
			options: ["Back to game", "Restart"],
			selectedOption: 0
		}
	}

	const initialPosition = {
		line: 0,
		collumn: 4
	}

	const piecesArray = getPiecesWithEmpty(false);

	function startNewGame() {
		if (game.intervalID) {
			clearInterval(game.intervalID);
		}

		game.state = new Array(boardSize.linesAmount);

		for (let line = 0; line < boardSize.linesAmount; line++) {
			game.state[line] = new Array(boardSize.collumnsAmount);
			game.state[line].fill('empty');
		}

		game.activatedPiece = generateNewPiece();
		game.nextPiece = generateNewPiece();
		game.donwSpeedMS.current = game.donwSpeedMS.max;
		game.level.current = game.level.min;
		game.score = 0;
		game.linesCounter = 0;
		game.canHold = true;
		game.holdedPiece = null;
		game.menu.isActive = false;

		game.intervalID = setInterval(fallPiece, game.donwSpeedMS.current, game);

		game.activatedPiece.place(game.state);
		notifyAll(game);
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

	function genericVerifyNextStep(stateObj, shape, position) {
		for (let line in shape) {
			for (let collumn in shape[line]) {
				if (position.line + Number(line) < 0 || position.line + Number(line) > boardSize.linesAmount - 1) {
					return false;
				}

				if (position.collumn + Number(collumn) < 0 || position.collumn + Number(collumn) > boardSize.collumnsAmount - 1) {
					return false;
				}

				let positionToAnalaise = stateObj[position.line + Number(line)][position.collumn + Number(collumn)];

				if (shape[line][collumn] == 1 && positionToAnalaise != 'empty') {
					return false;
				}
			}
		}

		return true;
	}

	function removeLine(stateObj, lineNumber) {
		for (let line = lineNumber; line > 0; line--) {
			stateObj[line] = [].concat(stateObj[Number(line) - 1]);
		}

		stateObj[0].fill('empty');
	}

	function levelUp(gameObj) {
		if (gameObj.level.current < gameObj.level.max) {
			gameObj.level.current += 1;
			gameObj.linesCounter -= 10;

			gameObj.donwSpeedMS.current = mapping(
				gameObj.level.current,
				gameObj.level.min,
				gameObj.level.max,
				gameObj.donwSpeedMS.max,
				gameObj.donwSpeedMS.min
			);
		}
	}

	function updateInterval(intervalID, callback, timeMS) {
		clearInterval(intervalID);
		return setInterval(callback, timeMS);
	}

	function getTurnScore(gameObj) {
		let scoreTypes = [0, 40, 100, 300, 1200];
		let linesRemoved = 0;

		for (let line in gameObj.state) {
			if (!gameObj.state[line].includes('empty')) {
				linesRemoved += 1;
				removeLine(gameObj.state, line);
			}
		}

		gameObj.linesCounter += linesRemoved;

		return gameObj.level.current * scoreTypes[linesRemoved];
	}

	function Piece(name, shape) {
		this.name = name;
		this.shape = shape;
		this.position = {
			line: initialPosition.line,
			collumn: initialPosition.collumn + 1 - Math.floor(this.shape[0].length / 2)
		}
		this.reset = function () {
			this.position.line = initialPosition.line;
			this.position.collumn = initialPosition.collumn + 1 - Math.floor(this.shape[0].length / 2);
		}
		this.place = function (stateObj) {
			for (let line in this.shape) {
				for (let collumn in this.shape[line]) {
					if (this.shape[line][collumn] == 1) {
						stateObj[this.position.line + Number(line)][this.position.collumn + Number(collumn)] = this.name;
					}
				}
			}
		}
		this.remove = function (stateObj) {
			for (let line in this.shape) {
				for (let collumn in this.shape[line]) {
					if (this.shape[line][collumn] == 1) {
						stateObj[this.position.line + Number(line)][this.position.collumn + Number(collumn)] = 'empty';
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
		this.canMove = function (stateObj, direction) {
			const movesToTry = {
				right(pieceObj) {
					return genericVerifyNextStep(stateObj, pieceObj.shape, {
						line: pieceObj.position.line,
						collumn: pieceObj.position.collumn + 1
					});
				},
				left(pieceObj) {
					return genericVerifyNextStep(stateObj, pieceObj.shape, {
						line: pieceObj.position.line,
						collumn: pieceObj.position.collumn - 1
					});
				},
				down(pieceObj) {
					return genericVerifyNextStep(stateObj, pieceObj.shape, {
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
		this.canRotate = function (stateObj) {
			for (let width in this.shape) {
				if (this.position.collumn - Number(width) < 0) {
					return { answer: false };
				}
				if (genericVerifyNextStep(stateObj, genericRotate(this.shape), { line: this.position.line, collumn: this.position.collumn - Number(width) })) {
					return { answer: true, move: Number(width) };
				}
			}

			return { answer: false };
		}
	}

	function generateNewPiece() {
		let pieceNumber = Math.floor(Math.random() * piecesArray.length);
		return new Piece(piecesArray[pieceNumber].name, piecesArray[pieceNumber].shape);
	}

	function fallPiece(gameObj) {
		gameObj.activatedPiece.remove(gameObj.state);

		if (gameObj.activatedPiece.canMove(gameObj.state, 'down')) {
			gameObj.activatedPiece.move('down');
		} else {
			gameObj.activatedPiece.place(gameObj.state);
			gameObj.score += getTurnScore(gameObj);
			gameObj.activatedPiece = gameObj.nextPiece;
			gameObj.nextPiece = generateNewPiece();
			gameObj.canHold = true;
		}

		gameObj.activatedPiece.place(gameObj.state);

		if (gameObj.linesCounter >= 10) {
			levelUp(gameObj);
			gameObj.intervalID = updateInterval(gameObj.intervalID, fallPiece, gameObj.donwSpeedMS.current);
		}

		notifyAll(gameObj);
	}

	function getInput(command) {
		const acceptedInputs = {
			down() {
				if (game.menu.isActive) {
					if(game.menu.selectedOption < game.menu.options.length - 1) {
						game.menu.selectedOption += 1;
					}
					console.log(game.menu.options[game.menu.selectedOption]);
				} else {
					fallPiece(game);
				}
			},
			up() {
				if (game.menu.isActive) {
					if (game.menu.selectedOption > 0) {
						game.menu.selectedOption -= 1;
					}
					console.log(game.menu.options[game.menu.selectedOption]);
				} else {
					//rotate
					game.activatedPiece.remove(game.state);

					if (game.activatedPiece.canRotate(game.state).answer) {
						for (let counter = game.activatedPiece.canRotate(game.state).move; counter > 0; counter--) {
							game.activatedPiece.move('left');
						}
						game.activatedPiece.rotate();
					}

					game.activatedPiece.place(game.state);
				}
			},
			right() {
				game.activatedPiece.remove(game.state);

				if (game.activatedPiece.canMove(game.state, command)) {
					game.activatedPiece.move(command);
				}

				game.activatedPiece.place(game.state);
			},
			left() {
				game.activatedPiece.remove(game.state);

				if (game.activatedPiece.canMove(game.state, command)) {
					game.activatedPiece.move(command);
				}

				game.activatedPiece.place(game.state);
			},
			control() {
				//hold
				if (game.canHold) {
					game.canHold = false;

					game.activatedPiece.remove(game.state);
					game.activatedPiece.reset();

					if (game.holdedPiece == null) {
						game.holdedPiece = game.activatedPiece;
						game.activatedPiece = game.nextPiece;
						game.nextPiece = generateNewPiece();
					} else {
						let auxiliarPiece = game.holdedPiece;
						game.holdedPiece = game.activatedPiece;
						game.activatedPiece = auxiliarPiece;
					}

					game.activatedPiece.place(game.state);
				}
			},
			escape() {
				//pause menu
				game.menu.isActive = !game.menu.isActive;
				console.log(`paused: ${game.menu.isActive}`);

				if(game.menu.isActive) {
					clearInterval(game.intervalID);
				} else {
					game.intervalID = setInterval(fallPiece, game.donwSpeedMS.current, game);
				}
			},
			enter() {
				if (game.menu.isActive) {
					const option = game.menu.options[game.menu.selectedOption];
					
					if(option == "Restart") {
						startNewGame();
						game.menu.isActive = false;
					}

					if(option == "Back to game") {
						game.intervalID = setInterval(fallPiece, game.donwSpeedMS.current, game);
						game.menu.isActive = false;
					}
				}
			}
		}

		if (acceptedInputs[command]) {
			acceptedInputs[command]();
			notifyAll(game);
		}
	}

	startNewGame();

	return {
		subscribe,
		getInput
	}
}