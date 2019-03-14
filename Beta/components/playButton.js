//播放按钮
AFRAME.registerComponent('playbutton', {
  schema: {
    analyserEl: { type: 'selector' },
    playing: {
      default: false,
      type: 'boolean'
    },
    visible: {
      type: 'boolean',
      default: false
    }
  },

  init() {

  },

  update() {
    let lastClick = 0
    let data = this.data;
    let analyserComponent = data.analyserEl.components.audioanalyser;

    //audioanalysernull

    this.el.addEventListener('click', () => {
      //debounce
      if (Date.now() - lastClick > 500) {
        lastClick = Date.now()
      } else {
        return
      }
      let playing = this.el.getAttribute('playbutton').playing;
      this.el.setAttribute('playbutton', 'playing', !playing);
      if (playing) {
        analyserComponent.analyser.context.suspend();
      } else {
        analyserComponent.analyser.context.resume();
      }
    })

    if (this.data.playing) {
      this.el.querySelector('a-plane').setAttribute('src', '#pause_button')
    } else {
      this.el.querySelector('a-plane').setAttribute('src', '#play_button')
    }

    if (this.data.visible) {
      this.el.setAttribute('scale', '0.15 0.015 0.15')
    } else {
      this.el.setAttribute('scale', '0 0 0')
    }
  }
})