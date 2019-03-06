//*****DUCK FRONT RIGHT*****

AFRAME.registerComponent('duck-02', {
    schema: {},
    init : function() {
        const Context_AF = this;
        Context_AF.soundElem = document.querySelector('#createSound');

        Context_AF.el.addEventListener('click', function(event) {
            console.log("click");
            //object clicked - lets create a cow!
            Context_AF.createCow();

            Context_AF.soundElem.components['sound'].stopSound(); //stop first so we aren't trying to play more than once at same time
            Context_AF.soundElem.components['sound'].playSound();
        });
    },
    createCow : function() {
        const Context_AF = this;

        //create element, than add attributes you want. If you are creating many =you want to 
        //consider "pooling" elements (i.e. not creating/deleting a bunch but just hiding/showing a certain MAX amount with visibility="true" or "false" )
        //see here: https://www.html5rocks.com/en/tutorials/speed/static-mem-pools/ 
        //see here: https://aframe.io/docs/0.8.0/components/pool.html
        let cowElem = document.createElement('a-entity');
        cowElem.setAttribute('obj-model', {obj:'/assets/models/duck.obj'});
        //cowElem.setAttribute('material', {src:'/assets/textures/Cow.png'});
        cowElem.setAttribute('remove-component', {}); 
        cowElem.setAttribute('position', {x:0.85, y:0.7, z:-5.25} );
        cowElem.setAttribute('scale', {x:1.2, y:1.2, z:1.2});
        
        let scene = document.querySelector('a-scene');
        scene.appendChild(cowElem);
    }
});