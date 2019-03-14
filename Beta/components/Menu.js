
const trackConfig = [
	{
		text: 'Levels',
		subText: 'ZHeight Color'
	},
]

AFRAME.registerComponent('menu', {
	schema: {
		shrink: {
			type: 'boolean',
			default: true
		},
		camera: { type: 'selector' },
		analyserEl: { type: 'selector' },
	},
	init() {
		this._itemWidth = 200
		this._itemHeight = 200

		let lastClick = Date.now()

		let analyserEl = this.data.analyserEl;
		let analyserComponent = this.data.analyserEl.components.audioanalyser;

		trackConfig.forEach((track, i) => {
			const plane = document.createElement('a-entity')
			plane.setAttribute('menu-item', {
				text: track.text,
				subText: track.subText,
			})
			this.el.appendChild(plane)

			

			const rotated = i !== 1 && i !== 4
			const moveForward = 0.07

			if (i < 4) {
				//top row
				plane.setAttribute('position', `${(i - 1.5)} 0 0}`)
			} else {
				//bottom row
				plane.setAttribute('position', `${(i - 5.5)} -0.76 0}`)
			}

			// const angle = 8
			// if (i === 0 || i === 3) {
			// 	plane.setAttribute('rotation', `0 ${angle} 0`)
			// } else if (i === 2 || i === 5) {
			// 	plane.setAttribute('rotation', `0 ${-angle} 0`)
			// }

			
			plane.addEventListener('click', () => {
				if (Date.now() - lastClick > 500) {
					lastClick = Date.now()
				} else {
					return
				}

				this.el.setAttribute('menu', 'shrink', true)

				const trackClone = {}
				Object.assign(trackClone, track)
				if (!plane.getAttribute('menu-item').selected) {
				
					this.el.emit('select', trackClone)
				} else {
				
					this.el.emit('unSelect', trackClone)
				}
			})
		})
	
		//？？？？let beatParticle = document.getElementById("beatParticle");
		this.el.addEventListener('select', (track) => {
			console.log("选择" + track.detail.text);
			switch (track.detail.text) {
				case "Levels":
					console.log("Begin Levels");
					analyserComponent.levelsEffectFlag = true;
					break;
				default:
					break;
			}
		})
		this.el.addEventListener('unSelect', (track) => {
			console.log("取消选择" + track.detail.text);
			switch (track.detail.text) {
				case "Levels":
					console.log("Stop Levels");
					analyserComponent.levelsEffectFlag = false;
					break;
				default:
					break;
			}
		})
		function setConvolution(index) {
			analyserComponent.sourceGainNode.gain.value = 0.8;
			for (i = 0; i < analyserComponent.gainNodes.length; i++) {
				analyserComponent.gainNodes[i].gain.value = 0.0;
			}
			if (index >= 0) {
				analyserComponent.gainNodes[index].gain.value = analyserComponent.convolutionInfo[index].sendGain;
				analyserComponent.sourceGainNode.gain.value = analyserComponent.convolutionInfo[index].mainGain;
			}
		}
	}
})