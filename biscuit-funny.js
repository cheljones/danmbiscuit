

var scene, renderer, camera;

initPDC(); //run function
window.addEventListener('resize', function (){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}, false);

function initPDC() {
    // create the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // and the camera
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );

    // How far away the camera is from our biscuit
    camera.position.set(0, 0, 750); // x y z
    camera.lookAt(new THREE.Vector3(0, 0, 0)); // direction camera points

    // The first argument to THREE.PointLight appears to be the color that the biscuit is illuminated with.
    var pointLight = new THREE.PointLight( 0xffffff, 0.8 ); // color, strength of light
    camera.add( pointLight ); // light comes from camera

    scene = new THREE.Scene();
    var ambientLight = new THREE.AmbientLight( 0xcccccc, 1 );
    scene.add( ambientLight );

    function newBasset(name, copies, folder, mtl_file, obj_file) {
        return new Promise(function(resolve, reject) {
            var mtlLoader = new THREE.MTLLoader();
            mtlLoader.setPath(folder);
            mtlLoader.load(mtl_file, function( materials ) {
                materials.preload();
                var objLoader = new THREE.OBJLoader();
                objLoader.setMaterials( materials );
                objLoader.setPath(folder);
                objLoader.load(obj_file, function ( object ) {
                    object.position.set(0, 0, 0);
                    object.name = name
                    scene.add( object );
                    Array(copies).fill().map(function () {
                        scene.add(object.clone())
                    })
                    resolve()
                });
            });
        })
    }

    newBasset(
        'bisc1',
        30,
        'bisc/', // the biscuit folder
        '59f116fab83ffbdbfeebb2fc_5a1bb2856bbc6105812c19aa_100lod.mtl',
        '59f116fab83ffbdbfeebb2fc_5a1bb2856bbc6105812c19a9_100lod.obj').then(
            function () {
                console.log(scene.children)
                renderer.render(scene, camera);

                // initialise controls
                var controls = new THREE.PointDragControls();
                controls.init( scene,camera,renderer, {
                    auto_render: true
                });
            }
        )
}
