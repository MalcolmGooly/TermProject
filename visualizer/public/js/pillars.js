AFRAME.registerComponent('pillars', {
    schema: {},
    init : function() {
        const Context_AF = this;
        Context_AF.soundElem = document.querySelector('#createSound');

        let source = 'assets/traffic (prod. by nxghts) 150bpm.mp3';
        let masterGain;
        var audioContext = new (window.AudioContext);
        masterGain = audioContext.createGain();
        masterGain.connect(audioContext.destination);
        let song = new Audio(source);
        songSource = audioContext.createMediaElementSource(song);
        songSource.connect(masterGain);
        song.play();
        const analyser = audioContext.createAnalyser();
        masterGain.connect(analyser);
        function updateWaveform() {
        requestAnimationFrame(updateWaveform);
        var dataArray = new Float32Array(analyser.frequencyBinCount);
        analyser.getFloatTimeDomainData(dataArray);
        };
    },
    
});

