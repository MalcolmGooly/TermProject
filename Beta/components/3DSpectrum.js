import ImprovedNoise from '../scripts/perlinNoise';
import config from '../scripts/config';

AFRAME.registerComponent('levels-scale', {
  schema: {
    analyserEl: { type: 'selector' },
    max: { default: 20 },
    multiplier: { default: 0.05 }//系数
  },
  init: function () {
    this.colors = new Array(config.spectrumNum).fill(0);
    this.noisePos = 0;
    this.perlin = new ImprovedNoise();
  },
  tick: function (time) {
    let data = this.data;
    let children;
    let levels;
   
    
    let colors = this.colors;
    this.noisePos += 0.005;
    colors.push((this.perlin.noise(this.noisePos, this.noisePos, 0)));
    colors.shift(1);

    let analyserComponent = data.analyserEl.components.audioanalyser;
    let el = this.el;
    if (!analyserComponent.levelsEffectFlag || !analyserComponent.analyser) {
      if (el.getAttribute("visible"))el.setAttribute("visible",false);
      return;
    } else {
      if (!el.getAttribute("visible")) el.setAttribute("visible",true);
    }

    //Calculation
    levels = analyserComponent.levels;//levels
    if (!levels) { return; }
    
    children = el.children;
    for (let i = 0; i < children.length; i++) {
      children[i].setAttribute('scale', {
        x: 1,
        y: Math.min(data.max, Math.max(levels[i*2] * data.multiplier, 0.05)),//i+4，128，fftsize1024
        z: 1
      });
      let color = new THREE.Color().setHSL(colors[i], 1, levels[i*2]/255);//(H)、(S)、(L)
      //children[i].setAttribute('material', 'opacity', levels[i*2]/255);//opacity change 
      children[i].setAttribute('material', 'color', color);//material
    }
  }
});

