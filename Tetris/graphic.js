export default function newGraphicCanvas(windowInput, canvasId) {
	const canvas = windowInput.document.getElementById(canvasId);
	const screen = canvas.getContext('2d');

	drawBackground();

	function drawBackground() {
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

	function drawSingleSquare(position, size, color, borderColor = null) {
		screen.fillStyle = color;
		screen.fillRect(position.x, position.y, size, size);
		if(borderColor != null) {
			screen.lineWidth = (1/50)*size;
			screen.fillStyle = borderColor;
			screen.strokeRect(position.x, position.y, size, size);
		}
	}
}