
import config from '../scripts/config';

//let config = window.config;

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}



AFRAME.registerComponent('entity-generator', {
    schema: {
        mixin: { default: '' },
        num: { default: config.spectrumNum }
    },
 
    init: function () {
        var data = this.data;

      
        for (var i = 0; i < data.num; i++) {
            var entity = document.createElement('a-entity');
            entity.setAttribute('mixin', data.mixin);
            this.el.appendChild(entity);
        }

    }
});
