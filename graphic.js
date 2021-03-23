import mapping from './mapping.js'

//Exibição
export default function newGraphicCanvas(windowInput, canvasId) {
	const canvas = windowInput.document.getElementById(canvasId);
	const screen = canvas.getContext("2d");

	const state = {
		size: 0,
		grid: []
	}

	let animationsList = [];

	function stateUpdate(gameStateObj) {
		if (state.size != gameStateObj.size) {
			state.size = gameStateObj.size;

			state.grid = new Array(state.size);
		}

		if (gameStateObj.type) {
			const moveTypes = {
				move() {
					let position = 0;

					for (position = position; position < animationsList.length; position++) {
						if (animationsList[position]) {
							if (animationsList[position].type == 'move') {
								break;
							}
						} else {
							break;
						}
					}

					if (position != animationsList.length) {
						for (position = position; position < animationsList.length; position++) {
							if (animationsList[position] &&
								animationsList[position].to &&
								animationsList[position].to.x == gameStateObj.from.x &&
								animationsList[position].to.y == gameStateObj.from.y) {

								animationsList.push({
									type: gameStateObj.type,
									from: gameStateObj.from,
									to: gameStateObj.to,
									value: gameStateObj.value,
									progress: 0,
									isActive: false,
									subordinate: null
								});

								animationsList[position].subordinate = (animationsList.length - 1) - position;

								return;
							}
						}
					}

					animationsList.push({
						type: gameStateObj.type,
						from: gameStateObj.from,
						to: gameStateObj.to,
						value: gameStateObj.value,
						progress: 0,
						isActive: true,
						subordinate: null
					});
				},
				join() {
					this.move();
				},
				appear() {
					animationsList.push({
						type: gameStateObj.type,
						in: gameStateObj.in,
						value: gameStateObj.value,
						progress: 0,
						isActive: false,
						subordinate: null
					});
				},
				newGame() {
					for (let position = 0; position < state.size; position++) {
						animationsList = [];
						state.grid[position] = new Array(state.size);
						state.grid[position].fill(0);
					}
				}
			}

			if (moveTypes[gameStateObj.type]) {
				moveTypes[gameStateObj.type]();
			}
		}
	}

	//desenha o novo frame
	function newFrame() {
		//limpa a tela
		screen.clearRect(0, 0, canvas.width, canvas.height);

		const block = {
			size: null,
			space: null
		}

		block.space = 80 / state.size;

		block.size = {
			width: (canvas.width - (state.size * block.space) - block.space) / state.size,
			height: (canvas.height - (state.size * block.space) - block.space) / state.size
		}

		screen.textBaseline = 'middle';
		screen.textAlign = 'center';

		//0 2 4 8 16 32 64 128 512 1024 2048 4096
		const colorPallet = ["#cdc0b4", "#eee4da", "#ede0c8", "#f2b179", "#f59563", "#f67c5f", "#f65e3b", "#edcf72", "#edcc61", "#edc850", "#edc53f", "#edc22e", "#3c3a32"];

		const color = {
			background: "#bbada0",
			//emptyBlock: 'white',
			block(value) {
				if (value < 11) {
					return colorPallet[value];
				} else {
					return colorPallet[11];
				}
			},
			text(value) {
				if (value < 3) {
					return "#222222";
				} else {
					return "#f9f6f2";
				}
			}
		}

		screen.fillStyle = color.background;
		screen.fillRect(0, 0, canvas.width, canvas.height);

		for (let line in state.grid) {
			for (let column in state.grid[line]) {
				printBlock(line, column, state.grid[line][column]);
			}
		}

		runAnimations();

		function runAnimations() {
			const animationStep = 100 / 2;

			const moves = {
				move(animationObj) {
					//printa o bloco em movimento
					if (animationObj.to.x != animationObj.from.x) {
						//vertical
						let progressRelation = (animationObj.to.x > animationObj.from.x) ? (animationObj.progress) : (100 - animationObj.progress);
						let blocksToMove = (Math.abs(animationObj.to.x - animationObj.from.x)) * (progressRelation) / 100;
						let absoluteBlockPosition = (animationObj.to.x > animationObj.from.x) ? (animationObj.from.x + blocksToMove) : (animationObj.to.x + blocksToMove);

						printBlock(absoluteBlockPosition, animationObj.to.y, animationObj.value);
					} else {
						//horizontal
						let progressRelation = (animationObj.to.y > animationObj.from.y) ? (animationObj.progress) : (100 - animationObj.progress);
						let blocksToMove = (Math.abs(animationObj.to.y - animationObj.from.y)) * (progressRelation) / 100;
						let absoluteBlockPosition = (animationObj.to.y > animationObj.from.y) ? (animationObj.from.y + blocksToMove) : (animationObj.to.y + blocksToMove);

						printBlock(animationObj.to.x, absoluteBlockPosition, animationObj.value);
					}
				},
				join(animationObj) {
					//printa o bloco em movimento
					if (animationObj.to.x != animationObj.from.x) {
						//vertical
						let progressRelation = (animationObj.to.x > animationObj.from.x) ? (animationObj.progress) : (100 - animationObj.progress);
						let blocksToMove = (Math.abs(animationObj.to.x - animationObj.from.x)) * (progressRelation) / 100;
						let absoluteBlockPosition = (animationObj.to.x > animationObj.from.x) ? (animationObj.from.x + blocksToMove) : (animationObj.to.x + blocksToMove);

						printBlock(absoluteBlockPosition, animationObj.to.y, animationObj.value);
					} else {
						//horizontal
						let progressRelation = (animationObj.to.y > animationObj.from.y) ? (animationObj.progress) : (100 - animationObj.progress);
						let blocksToMove = (Math.abs(animationObj.to.y - animationObj.from.y)) * (progressRelation) / 100;
						let absoluteBlockPosition = (animationObj.to.y > animationObj.from.y) ? (animationObj.from.y + blocksToMove) : (animationObj.to.y + blocksToMove);

						printBlock(animationObj.to.x, absoluteBlockPosition, animationObj.value);
					}

					//printa o bloco novo
					printBlock(animationObj.to.x, animationObj.to.y, animationObj.value);

					let size = block.size.width + 2 * block.space;

					//penultimo passo
					if (animationObj.progress + (3 * animationStep) >= 100) {
						printBlock(animationObj.to.x, animationObj.to.y, animationObj.value, size, size);
					}

					//ultimo passo
					if (animationObj.progress + animationStep >= 100) {

						printBlock(animationObj.to.x, animationObj.to.y, animationObj.value + 1, size, size);
					}
				},
				appear(animationObj) {
					let size = block.size.width * animationObj.progress / 100;
					printBlock(animationObj.in.x, animationObj.in.y, animationObj.value, size, size);
				}
			}

			const begin = {
				move(animationObj) {
					state.grid[animationObj.from.x][animationObj.from.y] = 0;
				},
				join(animationObj) {
					state.grid[animationObj.from.x][animationObj.from.y] = 0;
				},
				appear(animationObj) {

				}
			}

			const finish = {
				move(animationObj) {
					state.grid[animationObj.to.x][animationObj.to.y] = animationObj.value;
				},
				join(animationObj) {
					state.grid[animationObj.to.x][animationObj.to.y] = animationObj.value + 1;
				},
				appear(animationObj) {
					state.grid[animationObj.in.x][animationObj.in.y] = animationObj.value;
				}
			}

			for (let animation of animationsList) {
				if (animation.isActive == false) {
					continue;
				}

				if (animation.progress == 0) {
					begin[animation.type](animation);
				}

				if (moves[animation.type]) {
					moves[animation.type](animation);
				}

				animation.progress += animationStep;

				if (animation.progress >= 100) {
					console.log(`animated ${animation.type}`);
					finish[animation.type](animation);
					animation.isActive = false;
				}
			}

			if (animationsList[0] && animationsList[0].type == 'appear') {
				animationsList[0].isActive = true;
			}

			while (animationsList[0] && animationsList[0].progress >= 100) {
				if (animationsList[0].subordinate) {
					animationsList[animationsList[0].subordinate].isActive = true;
				}

				animationsList.shift();
			}
		}

		function printBlock(x, y, value, width = block.size.width, height = block.size.height) {
			let printParam = {
				init: {
					x: block.space + y * (block.size.width + block.space),
					y: block.space + x * (block.size.height + block.space)
				},
				size: block.size,
				textPosition: null
			}

			printParam.textPosition = {
				x: printParam.init.x + (printParam.size.width / 2),
				y: printParam.init.y + (printParam.size.height / 2)
			}

			screen.fillStyle = color.block(value);

			printParam.init.x += (block.size.width / 2) - (width / 2);
			printParam.init.y += (block.size.height / 2) - (height / 2);

			//screen.fillRect(printParam.init.x, printParam.init.y, width, height);
			screen.fillRoundRect(printParam.init.x, printParam.init.y, width, height, 8);

			if (value != 0) {
				screen.fillStyle = color.text(value);
				if (String(2 ** value).length < 3) {
					screen.font = `bold ${(2 / 3) * height}px Arial`;
					screen.fillText(String(2 ** value), printParam.textPosition.x, printParam.textPosition.y);
				} else {
					screen.font = `bold ${(2 / String(2 ** value).length) * (2 / 3) * height}px Arial`;
					screen.fillText(String(2 ** value), printParam.textPosition.x, printParam.textPosition.y);
				}
			}
		}

		windowInput.requestAnimationFrame(newFrame);
	}

	return {
		stateUpdate,
		newFrame
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