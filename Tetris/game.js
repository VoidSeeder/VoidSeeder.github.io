//10x20

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

	const state = new Array(boardSize.linesAmount);

	for (let line = 0; line < boardSize.linesAmount; line++) {
		state[line] = new Array(boardSize.collumnsAmount);
		state[line].fill('empty');
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
			return genericVerifyNextStep(gameObj, genericRotate(this.shape), this.position);
		}
	}

	const pieces = [];

	pieces.push({
		name: 'O',
		shape: [
			[1, 1],
			[1, 1]
		]
	});

	pieces.push({
		name: 'I',
		shape: [
			[1, 1, 1, 1]
		]
	});

	pieces.push({
		name: 'S',
		shape: [
			[0, 1, 1],
			[1, 1, 0]
		]
	});

	pieces.push({
		name: 'Z',
		shape: [
			[1, 1, 0],
			[0, 1, 1]
		]
	});

	pieces.push({
		name: 'L',
		shape: [
			[1, 0],
			[1, 0],
			[1, 1]
		]
	});

	pieces.push({
		name: 'J',
		shape: [
			[0, 1],
			[0, 1],
			[1, 1]
		]
	});

	pieces.push({
		name: 'T',
		shape: [
			[0, 1, 0],
			[1, 1, 1]
		]
	});

	let pieceNumber = Math.floor(Math.random() * pieces.length);
	let activatedPiece = new Piece(pieces[pieceNumber].name, pieces[pieceNumber].shape);

	function generateNewPiece() {
		let pieceNumber = Math.floor(Math.random() * pieces.length);
		return new Piece(pieces[pieceNumber].name, pieces[pieceNumber].shape);
	}

	setInterval(() => {
		let score = 0;
		activatedPiece.remove(state);

		if(activatedPiece.canMove(state, 'down')) {
			activatedPiece.move('down');
		} else {
			activatedPiece.place(state);
			score = getTurnScore(state);
			activatedPiece = generateNewPiece();
			console.log("score " + score);
		}

		activatedPiece.place(state);

		notifyAll({ state, score });
	}, 500);

	function getInput(command) {
		activatedPiece.remove(state);

		if (activatedPiece.canMove(state, command)) {
			activatedPiece.move(command);
			activatedPiece.place(state);

			return notifyAll({ state });
		}

		if (command == 'rotate') {
			//TO DO: corrigir problema que as vezes impede uma peça de rodar quando esta no canto direito
			if (activatedPiece.canRotate(state)) {
				activatedPiece.rotate();
			}

			activatedPiece.place(state);

			return notifyAll({ state });
		}

		return activatedPiece.place(state);
	}

	return {
		subscribe,
		getInput
	}
}