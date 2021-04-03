export default function getPiecesWithEmpty(addEmpty = true) {
	const piecesObj = [];

	piecesObj.push({
		name: 'O',
		shape: [
			[1, 1],
			[1, 1]
		],
		color: 'gold'
	});

	piecesObj.push({
		name: 'I',
		shape: [
			[1, 1, 1, 1]
		],
		color: 'darkcyan'
	});

	piecesObj.push({
		name: 'S',
		shape: [
			[0, 1, 1],
			[1, 1, 0]
		],
		color: 'red'
	});

	piecesObj.push({
		name: 'Z',
		shape: [
			[1, 1, 0],
			[0, 1, 1]
		],
		color: 'green'
	});

	piecesObj.push({
		name: 'L',
		shape: [
			[1, 0],
			[1, 0],
			[1, 1]
		],
		color: 'orange'
	});

	piecesObj.push({
		name: 'J',
		shape: [
			[0, 1],
			[0, 1],
			[1, 1]
		],
		color: 'deeppink'
	});

	piecesObj.push({
		name: 'T',
		shape: [
			[0, 1, 0],
			[1, 1, 1]
		],
		color: 'darkmagenta'
	});

	if (addEmpty) {
		piecesObj.push({
			name: 'empty',
			shape: [[0]],
			color: 'darkgrey'
		});
	}
	
	return piecesObj;
}