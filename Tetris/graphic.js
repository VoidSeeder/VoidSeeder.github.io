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

	drawScoreDiv();
	
	function drawScoreDiv() {
		screen.fillStyle = 'blue';
		screen.fillRoundRect((3*canvas.width/4) + 30, 30, 130, 80, 10);
		screen.fillStyle = 'white';
		screen.fillRoundRect((3*canvas.width/4) + 35, 75, 120, 30, 10);
		
		screen.textBaseline = 'middle';
		screen.textAlign = 'center';
		screen.translate((3*canvas.width/4) + 30, 30);
		screen.font = `bolder 36px Courier New`
		screen.fillText('SCORE', 130/2, 50/2);

		screen.fillStyle = 'blue'
		screen.textAlign = 'right';
		screen.font = `bold 20px Arial`
		screen.fillText('0', 130 - 10, 50 + 25/2);

		screen.resetTransform();
	}

	function stateUpdate(command) {
		updateBoard(command);
		if(command.score) {
			updateScore(command);
		}
		
	}

	function updateScore(command) {
		screen.fillStyle = 'white';
		screen.fillRoundRect((3*canvas.width/4) + 35, 75, 120, 30, 10);
		
		screen.textBaseline = 'middle';
		screen.fillStyle = 'blue'
		screen.textAlign = 'right';
		screen.font = `bold 20px Arial`
		screen.translate((3*canvas.width/4) + 30, 30);
		screen.fillText(`${command.score}`, 130 - 10, 50 + 25/2);

		screen.resetTransform();
	}

	function updateBoard(command) {
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