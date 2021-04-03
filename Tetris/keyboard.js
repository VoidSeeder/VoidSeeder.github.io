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
		let key = event.key;

		if(key.includes('Arrow')) {
			key = key.substring(5);
			// console.log(key);
		}

		notifyAll(key.toLowerCase());
	}

	return {
		subscribe
	};
}