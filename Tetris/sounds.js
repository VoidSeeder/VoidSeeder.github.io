export default function newSound() {
	let lastScore = 0;
	
	const soundEffects = {	
		fullLine: new Audio('./soundEffects/mixkit-explainer-video-game-alert-sweep-236.wav'),
		scoreUpdate: new Audio('./soundEffects/mixkit-retro-arcade-casino-notification-211.wav')
	}

	for (let audio in soundEffects) {
		soundEffects[audio].stop = function () {
			this.pause();
			this.currentTime = 0;
		}
	}

	function soundObserver (command) {
		for (let line in command.state) {
			if(!command.state[line].includes('empty')) {
				soundEffects.fullLine.stop();
				soundEffects.fullLine.play();
				break;
			}
		}

		if(command.score && command.score != lastScore) {
			soundEffects.fullLine.stop();
			soundEffects.scoreUpdate.play();
			lastScore = command.score;
		}
	}

	return {
		soundObserver
	}
}