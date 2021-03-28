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

	function stateUpdate(command) {
		screen.clearRect(boardBackground.position.x, boardBackground.position.y, boardBackground.width, boardBackground.height);
		for (let line in command.state) {
			for (let collumn in command.state[line]) {
				if (command.state[line][collumn] != 'empty') {
					// drawSquareFromPosition(line, collumn, 'red');
					drawSquareFromPosition(collumn, line, 'red');
				} else {
					// drawSquareFromPosition(line, collumn, 'darkgrey');
					drawSquareFromPosition(collumn, line, 'darkgrey');
				}
			}
		}
	}

	drawBackground();

	function drawBackground() {
		for (let line = 0; line < boardBackground.size.x; line++) {
			for (let collumn = 0; collumn < boardBackground.size.y; collumn++) {
				let squareSize = boardBackground.width / (boardBackground.size.x + (boardBackground.size.x + 1) * (boardBackground.size.spacing));
				let spacing = boardBackground.size.spacing * squareSize;
				let squarePosition = {
					x: Number(line) * (squareSize + spacing) + (boardBackground.position.x + spacing),
					y: Number(collumn) * (squareSize + spacing) + (boardBackground.position.y + spacing)
				}

				drawSingleSquare(squarePosition, squareSize, boardBackground.color.background);
			}
		}
	}

	function drawSquareFromPosition(positionX, positionY, color) {
		let squareSize = boardBackground.width / (boardBackground.size.x + (boardBackground.size.x + 1) * (boardBackground.size.spacing));
		let spacing = boardBackground.size.spacing * squareSize;
		let squarePosition = {
			x: Number(positionX) * (squareSize + spacing) + (boardBackground.position.x + spacing),
			y: Number(positionY) * (squareSize + spacing) + (boardBackground.position.y + spacing)
		}

		drawSingleSquare(squarePosition, squareSize, color);
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