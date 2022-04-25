const audio = document.getElementById('player');
let playing = false;
const play = () => { 
	if (window.innerWidth / window.innerHeight < 1.67) {
		document.getElementById('vizualizer').style.visibility = "hidden"
		alert("Vizualizer can't support your resolution!");
		return
	}
	if (playing) {
		document.getElementById('player').pause()
		playing = false;
	}
	else {
		document.getElementById('player').play()
		playing = true;
		setTimeout(() => {
			document.getElementById('song').style.color = "white"
		}, 10000)
	}
}

let mouse_IsDown = false
var analyser;
var fqData;
document.documentElement.addEventListener("mousedown", () => {

		if (mouse_IsDown) return

		if (window.innerWidth / window.innerHeight < 1.67) {
			document.getElementById('vizualizer').style.visibility = "hidden"
			return
		}
		mouse_IsDown = true

		const AudioContext = window.AudioContext || window.webkitAudioContext;
		const audioCtx = new AudioContext();
		audioCtx.resume()
		const audioSource = audioCtx.createMediaElementSource(audio)
		analyser = audioCtx.createAnalyser();
		audioSource.connect(analyser)
		audioSource.connect(audioCtx.destination)
		fqData = new Uint8Array(analyser.frequencyBinCount)
		analyser.getByteFrequencyData(fqData)
		console.log("fqData", fqData)
		console.log(fqData.length)
		const viz = document.getElementById('vizualizer')
		for (let i = 0; i < fqData.length; i+=8) {
			const bar = document.createElement("DIV");
			bar.setAttribute('id', `bar-${i}`)
			bar.setAttribute('class', 'viz-bar')
			viz.appendChild(bar)
		}
})

const renderFrame = () => {
	if (!mouse_IsDown) return;

	analyser.getByteFrequencyData(fqData);
	for (let i = 0; i < fqData.length; i+=8) {
		let fd = fqData[i];
		let bar = document.querySelector(`#bar-${i}`)
		if (!bar) {
			continue
		}

		let barHeight = Math.max(4, fd || 0);
		let height = barHeight/8
		if (height == 0.5) { height = 1 }
		bar.style.height = `${height}vh`;
	}
	
}

setInterval(() => {
	renderFrame()
}, 1)