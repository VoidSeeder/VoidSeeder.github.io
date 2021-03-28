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
					let shapeWidth = pieceObj.shape[0].length;

					for (let line in pieceObj.shape) {
						if(pieceObj.position.collumn + Number(shapeWidth) > boardSize.collumnsAmount - 1) {
							return false;
						}

						let positionToAnalaise = gameObj[pieceObj.position.line + Number(line)][pieceObj.position.collumn + shapeWidth];

						if (pieceObj.shape[line][shapeWidth - 1] == 1 && positionToAnalaise != 'empty') {
							return false;
						}
					}

					return true;
				},
				left(pieceObj) {
					for (let line in pieceObj.shape) {
						if(pieceObj.position.collumn - 1 < 0) {
							return false;
						}

						let positionToAnalaise = gameObj[pieceObj.position.line + Number(line)][pieceObj.position.collumn - 1];

						if (pieceObj.shape[line][0] == 1 && positionToAnalaise != 'empty') {
							return false;
						}
					}

					return true;
				},
				down(pieceObj) {
					let shapeHeight = pieceObj.shape.length;

					for (let collumn in pieceObj.shape[0]) {
						if(pieceObj.position.line + shapeHeight > boardSize.linesAmount - 1) {
							return false;
						}

						let positionToAnalaise = gameObj[pieceObj.position.line + shapeHeight][pieceObj.position.collumn + Number(collumn)];

						if (pieceObj.shape[shapeHeight - 1][collumn] == 1 && positionToAnalaise != 'empty') {
							return false;
						}
					}

					return true;
				}
			}

			if (movesToTry[direction]) {
				return movesToTry[direction](this);
			}

			return false;
		}
		this.canRotate = function (gameObj) {
			let shapeCopy = genericRotate(this.shape);

			for (let line in shapeCopy) {
				for (let collumn in shapeCopy[line]) {
					let positionToAnalaise = gameObj[this.position.line + Number(line)][this.position.collumn + Number(collumn)];

					if(shapeCopy[line][collumn] == 1 && positionToAnalaise != 'empty') {
						return false;
					}
				}
			}

			return true;
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
		activatedPiece.remove(state);

		if (activatedPiece.canMove(state, 'down')) {
			activatedPiece.move('down');
		} else {
			activatedPiece.place(state);
			activatedPiece = generateNewPiece();
		}

		activatedPiece.place(state);

		notifyAll({ state });

	}, 500);

	function getInput(command) {
		console.log(command);
		if(activatedPiece.canMove(state, command)) {
			activatedPiece.remove(state);
			activatedPiece.move(command);
			activatedPiece.place(state);

			notifyAll({ state });
		}

		if(command == 'rotate') {
			activatedPiece.remove(state);

			if(activatedPiece.canRotate(state)) {
				activatedPiece.rotate();
			}

			activatedPiece.place(state);

			notifyAll({ state });
		}
	}

	return {
		subscribe,
		getInput
	}
}