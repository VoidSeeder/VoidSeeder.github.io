import mapping from './mapping.js'

//Exibição
export default function newGraphicCanvas(windowInput, canvasId) {
	let lastTime = new Date();

	const canvas = windowInput.document.getElementById(canvasId);
	const screen = canvas.getContext("2d");

	const state = {
		size: 0,
		grid: []
	}

	let animationsList = {
		firstMoves: [],
		joins: [],
		lastMoves: [],
		appears: []
	};

	let nameAddAnimations = 'firstMoves';
	let nameRunningAnimations = 'firstMoves';
	let isGameOver = false;
	let isGameWon = false;
	let isKeepGoing = false;
	let isAnimationsActive = false;

	function stateUpdate(gameStateObj) {
		if (state.size != gameStateObj.size) {
			state.size = gameStateObj.size;

			state.grid = new Array(state.size);
		}

		function addMoveAnimation() {
			let position = animationsList[nameAddAnimations].length - 1;

			if (animationsList[nameAddAnimations][position] &&
				animationsList[nameAddAnimations][position].to.x == gameStateObj.from.x &&
				animationsList[nameAddAnimations][position].to.y == gameStateObj.from.y) {

				animationsList[nameAddAnimations].push({
					type: gameStateObj.type,
					from: gameStateObj.from,
					to: gameStateObj.to,
					value: gameStateObj.value,
					progress: 0,
					isActive: false,
					subordinate: null
				});

				animationsList[nameAddAnimations][position].subordinate = 1;

				return;
			}

			animationsList[nameAddAnimations].push({
				type: gameStateObj.type,
				from: gameStateObj.from,
				to: gameStateObj.to,
				value: gameStateObj.value,
				progress: 0,
				isActive: true,
				subordinate: null
			});
		}

		if (gameStateObj.type) {
			const moveTypes = {
				move() {
					if (nameAddAnimations == 'joins') {
						nameAddAnimations = 'lastMoves';
					} else if (nameAddAnimations == 'appears') {
						nameAddAnimations = 'firstMoves';
					}

					addMoveAnimation();
				},
				join() {
					if (nameAddAnimations == 'firstMoves') {
						nameAddAnimations = 'joins';
					}

					animationsList[nameAddAnimations].push({
						type: gameStateObj.type,
						from: gameStateObj.from,
						to: gameStateObj.to,
						value: gameStateObj.value,
						progress: 0,
						isActive: true,
						subordinate: null
					});
				},
				appear() {
					animationsList.appears.push({
						type: gameStateObj.type,
						in: gameStateObj.in,
						value: gameStateObj.value,
						progress: 0,
						isActive: true,
						subordinate: null
					});
				},
				newGame() {
					isGameOver = false;
					isGameWon = false;
					isKeepGoing = false;

					for (let position = 0; position < state.size; position++) {
						animationsList = {
							firstMoves: [],
							joins: [],
							lastMoves: [],
							appears: []
						};

						state.grid[position] = new Array(state.size);
						state.grid[position].fill(0);
					}

					nameAddAnimations = 'firstMoves';
					nameRunningAnimations = 'firstMoves';
					isAnimationsActive = true;
				},
				newAction() {
					//apagar todas as animações vigentes e iniciar uma nova cadeia de animações
					animationsList = {
						firstMoves: [],
						joins: [],
						lastMoves: [],
						appears: []
					};

					for (let line in state.grid) {
						for (let collum in state.grid[line]) {
							if (gameStateObj.grid) {
								state.grid[line][collum] = gameStateObj.grid[line][collum];
							} else {
								state.grid[line][collum] = 0;
							}
						}
					}

					nameAddAnimations = 'firstMoves';
					nameRunningAnimations = 'firstMoves';
					isAnimationsActive = true;
				},
				gameOver() {
					isGameOver = true;
				},
				gameWon() {
					isGameWon = true;
				},
				keepGoing() {
					isKeepGoing = true;
				}
			}

			if (moveTypes[gameStateObj.type]) {
				moveTypes[gameStateObj.type]();
			}
		}
	}

	//desenha o novo frame
	function newFrame() {
		const block = {
			size: null,
			space: null
		}

		block.space = 80 / state.size;

		block.size = {
			width: (canvas.width - ((state.size + 1) * block.space)) / state.size,
			height: (canvas.height - ((state.size + 1) * block.space)) / state.size
		}

		screen.textBaseline = 'middle';
		screen.textAlign = 'center';

		//0 2 4 8 16 32 64 128 512 1024 2048 4096
		const colorPallet = ["#cdc0b4", "#eee4da", "#ede0c8", "#f2b179", "#f59563", "#f67c5f", "#f65e3b", "#edcf72", "#edcc61", "#edc850", "#edc53f", "#edc22e", "#3c3a32"];

		const color = {
			background: "#bbada0",
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

		//limpa a tela
		screen.clearRect(0, 0, canvas.width, canvas.height);

		screen.fillStyle = color.background;
		screen.fillRect(0, 0, canvas.width, canvas.height);

		for (let line in state.grid) {
			for (let column in state.grid[line]) {
				printBlock(line, column, state.grid[line][column]);
			}
		}

		isAnimationsActive = true;

		if (animationsList.firstMoves.length > 0) {
			nameRunningAnimations = 'firstMoves';
		} else if (animationsList.joins.length > 0) {
			nameRunningAnimations = 'joins';
		} else if (animationsList.lastMoves.length > 0) {
			nameRunningAnimations = 'lastMoves';
		} else if (animationsList.appears.length > 0) {
			nameRunningAnimations = 'appears';
		} else {
			isAnimationsActive = false;

			if (!isKeepGoing && isGameWon) {
				//printa game won
				screen.fillStyle = `rgba(255, 255, 255, ${0.5})`;
				screen.fillRect(0, 0, canvas.width, canvas.height);
			} else if (!isKeepGoing && isGameOver) {
				//printa game over
				screen.fillStyle = `rgba(${0xFF}, ${0xFF}, ${0xFF}, ${0.5})`;
				screen.fillRect(0, 0, canvas.width, canvas.height);

				let warning = {
					color: {
						background: '#4CAF50',
						text: 'white'
					},
					size: {
						width: 400,
						height: 150,
						text: '60px'
					}
				}
				
				screen.fillStyle = warning.color.background;
				screen.translate(canvas.width / 2, canvas.height / 2);
				screen.fillRoundRect(-warning.size.width / 2, -warning.size.height / 2, warning.size.width, warning.size.height, (8/125)*warning.size.height);
				screen.fillStyle = warning.color.text;
				screen.font = `bold ${warning.size.text} Arial`;
				screen.fillText("Game Over", 0, 0);
				screen.translate(-canvas.width / 2, -canvas.height / 2);
			}
		}

		if (isAnimationsActive) {
			runAnimations();
		}

		lastTime = new Date();

		function runAnimations() {
			const animationTimeMS = 50;
			const currentTime = new Date();
			const timeDifferenceMS = currentTime.getTime() - lastTime.getTime();

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

					if (animationObj.progress >= 40 && animationObj.progress < 80) {
						printBlock(animationObj.to.x, animationObj.to.y, animationObj.value, size, size);
					}

					if (animationObj.progress >= 80) {

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

			for (let animation of animationsList[nameRunningAnimations]) {
				if (animation.isActive == false) {
					continue;
				}

				if (animation.progress == 0) {
					begin[animation.type](animation);
				}

				if (moves[animation.type]) {
					moves[animation.type](animation);
				}

				animation.progress += (timeDifferenceMS / animationTimeMS) * 100;

				if (animation.progress >= 100) {
					finish[animation.type](animation);
					animation.isActive = false;
				}
			}

			while (animationsList[nameRunningAnimations][0] && animationsList[nameRunningAnimations][0].progress >= 100) {
				if (animationsList[nameRunningAnimations][0].subordinate) {
					animationsList[nameRunningAnimations][animationsList[nameRunningAnimations][0].subordinate].isActive = true;
				}

				animationsList[nameRunningAnimations].shift();
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

			screen.fillRoundRect(printParam.init.x, printParam.init.y, width, height, (8 / 125) * width);

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