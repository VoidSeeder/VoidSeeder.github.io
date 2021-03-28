export default function newKeyboardListner(windowInput) {
	const keyboard = {
		observers: []
	}

	function subscribe(observerFunction) {
		keyboard.observers.push(observerFunction);
	}

	function notifyAll(command) {
		for (let observerFunction of keyboard.observers) {
			observerFunction(command);
		}
	}

	windowInput.document.addEventListener("keydown", keyPressed);

	function keyPressed(event) {
		const key = event.key;

		const acceptedKeys = {
			ArrowUp() {
				notifyAll('rotate');
			},
			ArrowDown() {
				notifyAll('down');
			},
			ArrowRight() {
				notifyAll('right');
			},
			ArrowLeft() {
				notifyAll('left');
			}
			// Backspace() {
			// 	notifyAll('backspace');
			// },
			// Enter() {
			// 	notifyAll('enter');
			// }
		}

		if (acceptedKeys[key]) {
			event.preventDefault();
			acceptedKeys[key]();
		}
	}

	return {
		subscribe
	};
}