import BeginPanel from './beginPanel/BeginPanel';
import isOnBeat from '../scripts/RealTimeDetect';
import initEnvEffect from '../scripts/EnvEffect';


AFRAME.registerComponent('audioanalyser', {
	schema: {
		enableLevels: { default: true },
		enableWaveform: { default: true },
		enableVolume: { default: true },
		fftSize: { default: 2048 },
		smoothingTimeConstant: { default: 0.8 },
		src: { type: 'selector' },
		enableBeatDetection: { default: false },
		enableBigBeat: { default: false },
		enableEyesDraw: { default: false }
	},

	init: function () {
		this.analyser = null;
		this.levels = null;
		this.waveform = null;
		this.volume = 0;
		this.waveEffectFlag = false;
		this.levelsEffectFlag = false;
		this.lightEffectFlag = false;
		this.eyesDraw = false;
		
		this.prevTime = 0;
		this.bpmTable = [];
		this.historyBuffer = [];
		this.context = null;
		this.decodeBuffer = null;

		let data = this.data;
		let self = this;

		this.oldNow = 0;

		this.bigBeatArr = [];

		if (!data.src) { return; }

	
		let context = this.context = new AudioContext();
		let analyser = this.analyser = this.context.createAnalyser();

		let audioEl = data.src;
		this.audio = audioEl;

		//analyser
		analyser.smoothingTimeConstant = data.smoothingTimeConstant;
		analyser.fftSize = data.fftSize;

		//frequencyBinCountfftSize2048）.
		this.levels = new Uint8Array(this.analyser.frequencyBinCount);
		this.waveform = new Uint8Array(this.analyser.fftSize);//FFT2048)

		//44032 1s(44100/1024=43fft,43个levels)
		//44100/2048 => 43/2 => 22
		this.MAX_COLLECT_SIZE = 22 * (this.analyser.fftSize / 2);
		this.COLLECT_SIZE = 1;
		
		for (let i = 0; this.historyBuffer.length < this.MAX_COLLECT_SIZE - this.COLLECT_SIZE - 1; i++) {
			this.historyBuffer.push(1);
		}
	
		let {envEffectIndex, convolutionInfo, sourceGainNode, convolutionNodes, gainNodes} = initEnvEffect(context);
		
		this.envEffectIndex = envEffectIndex;this.convolutionInfo = convolutionInfo;this.sourceGainNode = sourceGainNode;this.convolutionNodes = convolutionNodes;this.gainNodes = gainNodes;
		BeginPanel(context, analyser, this.bigBeatArr, convolutionNodes, gainNodes, sourceGainNode, convolutionInfo);//预分析
	},

	
	tick: function () {
		let data = this.data;

		// Levels
		if (data.enableLevels) {
			this.analyser.getByteFrequencyData(this.levels);
		}

		// Waveform.
		if (data.enableWaveform) {
			this.analyser.getByteTimeDomainData(this.waveform);
		}

		// Average volume.
		if (data.enableVolume) {
			let sum = 0;
			for (let i = 0; i < this.levels.length; i++) {
				sum += this.levels[i];;
			}
			this.volume = sum / this.levels.length;

			this.instantEnergy = sum;
		}
		

		if (data.enableBeatDetection) {
			if (isOnBeat.call(this)) {
				this.el.emit('audioanalyser-beat');
			}
		}

		if (data.enableBigBeat || data.enableEyesDraw) {
			let now = Math.floor(this.audio.currentTime / this.audio.duration * 10000);
			if (this.bigBeatArr.includes(now)) {
				if (this.oldNow === now) return;
				this.el.emit('audioanalyser-bigbeat');
				this.oldNow = now;
			};
		}
	}
});
