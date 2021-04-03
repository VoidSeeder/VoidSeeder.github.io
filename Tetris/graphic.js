import getPiecesWithEmpty from "./pieces.js";

export default function newGraphicCanvas(windowInput, canvasId) {
	const canvas = windowInput.document.getElementById(canvasId);
	const screen = canvas.getContext('2d');

	const boardBackground = {
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
		color: {
			background: 'darkgrey',
			border: 'black'
		}
	}

	boardBackground.squareSize = boardBackground.width / (boardBackground.size.x + (boardBackground.size.x + 1) * (boardBackground.size.spacing));
	boardBackground.spacing = boardBackground.size.spacing * boardBackground.squareSize;

	const pieces = getPiecesWithEmpty(true);

	drawScoreDiv();

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
	}

	drawNextPieceDiv();

	function drawNextPieceDiv() {
		let size = {
			w: (4 * boardBackground.squareSize) + ((2 + 4) * boardBackground.spacing),
			h: (3 * boardBackground.squareSize) + ((2 + 3) * boardBackground.spacing)
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
	}

	function stateUpdate(command) {
		updateBoard(command);
		updateScore(command);
		updateNextPiece(command);
	}

	function updateScore(command) {
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

	function updateNextPiece(command) {
		const nextPieceObj = pieces.find(element => element.name == command.nextPiece.name);
		const size = {
			w: (4 * boardBackground.squareSize) + ((2 + 4) * boardBackground.spacing),
			h: (3 * boardBackground.squareSize) + ((2 + 3) * boardBackground.spacing)
		}

		screen.fillStyle = 'white';
		screen.fillRoundRect(15, 55, size.w, size.h, 10);

		screen.translate(15 + (size.w / 2), 55 + (size.h / 2));
		screen.translate(-(boardBackground.squareSize + boardBackground.spacing / 2) * nextPieceObj.shape[0].length / 2, -(boardBackground.squareSize + boardBackground.spacing / 2) * nextPieceObj.shape.length / 2);

		for (let line in nextPieceObj.shape) {
			for (let collumn in nextPieceObj.shape[line]) {
				if (nextPieceObj.shape[line][collumn] == 1) {
					drawSingleSquare({ x: Number(collumn) * (boardBackground.squareSize + boardBackground.spacing), y: Number(line) * (boardBackground.squareSize + boardBackground.spacing) }, boardBackground.squareSize, nextPieceObj.color, 'black');
				}
			}
		}

		nextPieceObj.shape.length

		screen.resetTransform();
	}

	function updateBoard(command) {
		let color;

		screen.clearRect(boardBackground.position.x, boardBackground.position.y, boardBackground.width, boardBackground.height);
		for (let line in command.state) {
			for (let collumn in command.state[line]) {
				if (!command.state[line].includes('empty')) {
					color = 'white';
				} else {
					color = pieces.find(element => element.name == command.state[line][collumn]).color;
				}

				drawSquareFromPosition(collumn, line, color, 'black');
			}
		}
	}

	function drawSquareFromPosition(positionX, positionY, color, borderColor = null) {
		let squarePosition = {
			x: Number(positionX) * (boardBackground.squareSize + boardBackground.spacing) + (boardBackground.position.x + boardBackground.spacing),
			y: Number(positionY) * (boardBackground.squareSize + boardBackground.spacing) + (boardBackground.position.y + boardBackground.spacing)
		}

		drawSingleSquare(squarePosition, boardBackground.squareSize, color, borderColor);
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