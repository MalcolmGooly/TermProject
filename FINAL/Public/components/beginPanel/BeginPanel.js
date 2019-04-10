import config from '../../scripts/config.js';
import PreAnalysis from '../../scripts/PreAnalysis.js';

//let config = window.config;
//let PreAnalysis = window.config;


function BeginPanel(context, analyser, bigBeatArr, convolutionNodes, gainNodes, sourceGainNode, convolutionInfo) {
	let beginBtn = document.getElementById('beginBtn');
	let audio = document.getElementById('song');//audioEl
	let audioFile = document.getElementById('file');
	let beginPanel = document.getElementById('beginPanel');
	let singBtn = document.getElementById('singBtn');

	beginBtn.addEventListener('click', () => {
		handleAudio('click');
	})

	audioFile.addEventListener('change', () => {
		let file = audioFile.files[0];
		audio.src = URL.createObjectURL(file);

		handleAudio('change');
	})

	//Just Sing 
	singBtn.addEventListener('click', () => {
		let constraints = { audio: true };
		navigator.mediaDevices.getUserMedia(constraints)
			.then(function (stream) {
				let sourceInit = context.createMediaStreamSource(stream);
				sourceInit.connect(sourceGainNode);
				sourceGainNode.connect(analyser);
				analyser.connect(context.destination);
			
				for (let i = 0; i < convolutionNodes.length; i++) {
					sourceInit.connect(convolutionNodes[i]);
					convolutionNodes[i].connect(gainNodes[i]);
					gainNodes[i].connect(analyser);
					analyser.connect(context.destination);
				}

		
				let buffer = context.createBuffer(1, 1, config.sampleRateGuess / 2);
				let source = context.createBufferSource();
				source.buffer = buffer;
				source.connect(context.destination);
				source.start(0);
			})
			.catch(function (err) {
				console.log(err);
		
			});
		beginPanel.remove();
	})

	let handleAudio = (flag) => {
	
		let sourceInit = context.createMediaElementSource(audio);
		sourceInit.connect(sourceGainNode);
		sourceGainNode.connect(analyser);


		for (let i = 0; i < convolutionNodes.length; i++) {
			sourceInit.connect(convolutionNodes[i]);
			convolutionNodes[i].connect(gainNodes[i]);
			gainNodes[i].connect(analyser);
			analyser.connect(context.destination);
		}
		

		// For mobile
		
		
		// create empty buffer
		// create new buffer source for playback with an already
		// loaded and decoded empty sound file
		// let source = self.context.createBufferSource();
		// alert(self.decodeBuffer);//已经解码完的buffer数据
		// source.buffer = self.decodeBuffer;
		// // connect to output (your speakers)
		// source.connect(self.analyser);
		// self.analyser.connect(self.context.destination);
		// // play the file
		// source.start(0);

		context
		// create empty buffer
		let buffer = context.createBuffer(1, 1, config.sampleRateGuess / 2);
		let source = context.createBufferSource();
		source.buffer = buffer;
		source.connect(context.destination);
		source.start(0);

		//For Mobile
		audio.play();

		beginPanel.remove();//todo 

		//For Firework
	
		if (flag === 'click') {
			PreAnalysis(audio, bigBeatArr);
		} else {
			audio.oncanplaythrough = () => {
				PreAnalysis(audio, bigBeatArr);
			};
		}
	}
}

export default BeginPanel;
//window.config = BeginPanel;