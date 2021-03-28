//10x20

export default function newGame() {
	const boardSize = {
		x: 10,
		y: 20
	}

	const state = new Array(boardSize.x);

	for (let line = 0; line < boardSize.x; line++) {
		state[line] = new Array(boardSize.y);
		state[line].fill('empty');
	}

	console.table(state);

	const initialPosition = {
		x: 4,
		y: 0
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
			x: initialPosition.x + 1 - Math.floor(this.shape[0].length / 2),
			y: initialPosition.y
		}
		this.place = function (gameObj) {
			for (let line in this.shape) {
				for (let collumn in this.shape[line]) {
					if (this.shape[line][collumn] == 1) {
						gameObj[this.position.x + Number(line)][this.position.y + Number(collumn)] = this.name;
					}
				}
			}
		}
		this.remove = function (gameObj) {
			for (let line in this.shape) {
				for (let collumn in this.shape[line]) {
					if (this.shape[line][collumn] == 1) {
						gameObj[this.position.x + Number(line)][this.position.y + Number(collumn)] = 'empty';
					}
				}
			}
		}
		this.move = function (direction) {
			const acceptedMoves = {
				right(pieceObj) {
					if (pieceObj.position.x + 1 < boardSize.x - 1) {
						pieceObj.position.x += 1;
					}
				},
				left(pieceObj) {
					if (pieceObj.position.x - 1 > 0) {
						pieceObj.position.x -= 1;
					}
				},
				down(pieceObj) {
					if (pieceObj.position.y + pieceObj.shape[0].length < boardSize.y) {
						pieceObj.position.y += 1;
					}
				}
			}

			if (acceptedMoves[direction]) {
				acceptedMoves[direction](this);
			}
		}
		this.rotate = function () {
			this.shape = genericRotate(this.shape);
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

	let pieceNumber = Math.floor(Math.random()*pieces.length);
	let activatedPiece = new Piece(pieces[pieceNumber].name, pieces[pieceNumber].shape);
	activatedPiece.rotate();
	activatedPiece.place(state);

	setInterval(() => {
		console.clear();
		activatedPiece.remove(state);
		activatedPiece.move('down');
		activatedPiece.place(state);
		console.table(state);
	}, 500)
}