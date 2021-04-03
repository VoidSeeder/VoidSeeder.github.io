import getPiecesWithEmpty from "./pieces.js";

export default function newGraphicCanvas(windowInput, canvasId) {
	const canvas = windowInput.document.getElementById(canvasId);
	const screen = canvas.getContext('2d');

	function drawBoardDiv() {
		const board = {
			width: canvas.width / 2,
			height: canvas.height,
			position: {
				x: canvas.width / 4,
				y: 0
			},
			size: {
				x: 10,
				y: 20,
				spacing: 1 / 20
			},
			borderColor: 'black'
		}

		board.squareSize = board.width / (board.size.x + (board.size.x + 1) * (board.size.spacing));
		board.spacing = board.size.spacing * board.squareSize;

		board.pieces = getPiecesWithEmpty(true);

		board.update = function (command) {
			let color;

			screen.clearRect(board.position.x, board.position.y, board.width, board.height);
			for (let line in command.state) {
				for (let collumn in command.state[line]) {
					if (!command.state[line].includes('empty')) {
						color = 'white';
					} else {
						color = board.pieces.find(element => element.name == command.state[line][collumn]).color;
					}

					drawSquareFromPosition(collumn, line, color, board.borderColor);
				}
			}
		}

		return board
	}

	function drawScoreDiv() {
		screen.fillStyle = 'blue';
		screen.fillRoundRect((3 * canvas.width / 4) + 30, 30, 130, 80, 10);
		screen.fillStyle = 'white';
		screen.fillRoundRect((3 * canvas.width / 4) + 35, 75, 120, 30, 10);

		screen.textBaseline = 'middle';
		screen.textAlign = 'center';
		screen.translate((3 * canvas.width / 4) + 30, 30);
		screen.font = `bolder 36px Courier New`
		screen.fillText('SCORE', 130 / 2, 50 / 2);

		screen.fillStyle = 'blue'
		screen.textAlign = 'right';
		screen.font = `bold 20px Arial`
		screen.fillText('0', 130 - 10, 50 + 25 / 2);

		screen.resetTransform();

		function update(command) {
			screen.fillStyle = 'white';
			screen.fillRoundRect((3 * canvas.width / 4) + 35, 75, 120, 30, 10);

			screen.textBaseline = 'middle';
			screen.fillStyle = 'blue'
			screen.textAlign = 'right';
			screen.font = `bold 20px Arial`
			screen.translate((3 * canvas.width / 4) + 30, 30);
			screen.fillText(`${command.score}`, 130 - 10, 50 + 25 / 2);

			screen.resetTransform();
		}

		return {
			update
		}
	}

	function drawNextPieceDiv() {
		const size = {
			w: (4 * board.squareSize) + ((2 + 4) * board.spacing),
			h: (3 * board.squareSize) + ((2 + 3) * board.spacing)
		}

		screen.fillStyle = 'blue';
		screen.fillRoundRect(10, 10, size.w + 10, size.h + 10 + 40, 10);

		screen.fillStyle = 'white';
		screen.textBaseline = 'middle';
		screen.textAlign = 'center';
		screen.translate(10, 10);
		screen.font = `bolder 22px Courier New`
		screen.fillText('NEXT PIECE', (size.w + 10) / 2, 50 / 2);

		screen.resetTransform();

		function update(command) {
			const nextPieceObj = board.pieces.find(element => element.name == command.nextPiece.name);

			screen.fillStyle = 'white';
			screen.fillRoundRect(15, 55, size.w, size.h, 10);

			screen.translate(15 + (size.w / 2), 55 + (size.h / 2));
			screen.translate(-(board.squareSize + board.spacing / 2) * nextPieceObj.shape[0].length / 2, -(board.squareSize + board.spacing / 2) * nextPieceObj.shape.length / 2);

			for (let line in nextPieceObj.shape) {
				for (let collumn in nextPieceObj.shape[line]) {
					if (nextPieceObj.shape[line][collumn] == 1) {
						drawSingleSquare({ x: Number(collumn) * (board.squareSize + board.spacing), y: Number(line) * (board.squareSize + board.spacing) }, board.squareSize, nextPieceObj.color, board.borderColor);
					}
				}
			}

			screen.resetTransform();
		}

		return {
			update
		}
	}

	function drawHoldedPieceDiv() {
		const size = {
			w: (4 * board.squareSize) + ((2 + 4) * board.spacing),
			h: (3 * board.squareSize) + ((2 + 3) * board.spacing)
		}

		screen.fillStyle = 'blue';
		screen.fillRoundRect(10, 200, size.w + 10, size.h + 10 + 40, 10);

		screen.fillStyle = 'white';
		screen.textBaseline = 'middle';
		screen.textAlign = 'center';
		screen.translate(10, 200);
		screen.font = `bolder 20px Courier New`
		screen.fillText('HOLDED PIECE', (size.w + 10) / 2, 50 / 2);

		screen.resetTransform();

		function update(command) {
			screen.fillStyle = 'white';
			screen.fillRoundRect(15, 55 + 200 - 10, size.w, size.h, 10);
			
			if(command.holdedPiece == null) {
				return
			}

			const holdedPieceObj = board.pieces.find(element => element.name == command.holdedPiece.name);

			screen.translate(15 + (size.w / 2), 55 + 200 - 10 + (size.h / 2));
			screen.translate(-(board.squareSize + board.spacing / 2) * holdedPieceObj.shape[0].length / 2, -(board.squareSize + board.spacing / 2) * holdedPieceObj.shape.length / 2);

			for (let line in holdedPieceObj.shape) {
				for (let collumn in holdedPieceObj.shape[line]) {
					if (holdedPieceObj.shape[line][collumn] == 1) {
						drawSingleSquare({ x: Number(collumn) * (board.squareSize + board.spacing), y: Number(line) * (board.squareSize + board.spacing) }, board.squareSize, holdedPieceObj.color, board.borderColor);
					}
				}
			}

			screen.resetTransform();
		}

		return {
			update
		}
	}
	
	function drawSquareFromPosition(positionX, positionY, color, borderColor = null) {
		let squarePosition = {
			x: Number(positionX) * (board.squareSize + board.spacing) + (board.position.x + board.spacing),
			y: Number(positionY) * (board.squareSize + board.spacing) + (board.position.y + board.spacing)
		}

		drawSingleSquare(squarePosition, board.squareSize, color, borderColor);
	}

	function drawSingleSquare(position, size, color, borderColor = null) {
		screen.fillStyle = color;
		screen.fillRect(position.x, position.y, size, size);
		if (borderColor != null) {
			screen.lineWidth = (1 / 50) * size;
			screen.fillStyle = borderColor;
			screen.strokeRect(position.x, position.y, size, size);
		}
	}

	const board = drawBoardDiv();
	const scoreDiv = drawScoreDiv();
	const nextPieceDiv = drawNextPieceDiv();
	const holdedPieceDiv = drawHoldedPieceDiv();

	function stateUpdate(command) {
		board.update(command);
		scoreDiv.update(command);
		nextPieceDiv.update(command);
		holdedPieceDiv.update(command);
	}


	return {
		stateUpdate
	}
}

CanvasRenderingContext2D.prototype.fillRoundRect = function (x, y, width, height, radius) {
	if (width < 2 * radius) radius = width / 2;
	if (height < 2 * radius) radius = height / 2;
	this.beginPath();
	this.moveTo(x + radius, y);
	this.arcTo(x + width, y, x + width, y + height, radius);
	this.arcTo(x + width, y + height, x, y + height, radius);
	this.arcTo(x, y + height, x, y, radius);
	this.arcTo(x, y, x + width, y, radius);
	this.closePath();
	this.fill();
	return this;
}