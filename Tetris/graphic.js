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

	const pieceColors = {
		'empty': 'darkgrey',
		'O': 'gold',
		'I': 'darkcyan',
		'S': 'red',
		'Z': 'green',
		'L': 'orange',
		'J': 'deeppink',
		'T': 'darkmagenta'
	}

	function stateUpdate(command) {
		let color;

		screen.clearRect(boardBackground.position.x, boardBackground.position.y, boardBackground.width, boardBackground.height);
		for (let line in command.state) {
			for (let collumn in command.state[line]) {
				if(!command.state[line].includes('empty')) {
					color = 'white';
				} else {
					color = pieceColors[command.state[line][collumn]];
				}
				
				drawSquareFromPosition(collumn, line, color, 'black');
			}
		}
	}

	function drawSquareFromPosition(positionX, positionY, color, borderColor = null) {
		let squareSize = boardBackground.width / (boardBackground.size.x + (boardBackground.size.x + 1) * (boardBackground.size.spacing));
		let spacing = boardBackground.size.spacing * squareSize;
		let squarePosition = {
			x: Number(positionX) * (squareSize + spacing) + (boardBackground.position.x + spacing),
			y: Number(positionY) * (squareSize + spacing) + (boardBackground.position.y + spacing)
		}

		drawSingleSquare(squarePosition, squareSize, color, borderColor);
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