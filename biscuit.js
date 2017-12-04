// two variables the example used, I don't think we need them. TODO findout if we need them

var scene;
var camera, renderer;

init();
window.addEventListener('resize', function (){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}, false);

function init() {
    // create the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // and the camera
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );

    // How far away the camera is from our biscuit
    camera.position.set(0, 0, 1000);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // The first argument to THREE.PointLight appears to be the color that the biscuit is illuminated with.
    var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( pointLight );

    scene = new THREE.Scene();
    scene.background = new THREE.Color('black');
    var ambientLight = new THREE.AmbientLight( 0xcccccc, 1 );
    scene.add( ambientLight );

    function newBasset(name, copies, folder, mtl_file, obj_file, scale, xpos) {
        return new Promise(function(resolve, reject) {
            var mtlLoader = new THREE.MTLLoader();
            mtlLoader.setPath(folder);
            mtlLoader.load(mtl_file, function( materials ) {
                materials.preload();
                var objLoader = new THREE.OBJLoader();
                objLoader.setMaterials( materials );
                objLoader.setPath(folder);
                objLoader.load(obj_file, function ( object ) {
                    object.children[0].position.set(xpos, 0, 0);
                    object.name = name;
                    object.children[0].scale.set(scale, scale, scale);
                    scene.add( object );
                    Array(copies).fill().map(function () {
                        scene.add(object.clone());
                    })
                    resolve();
                });
            });
        })
    }

    promises = []
    promises.push(newBasset(
        'bisc1',
        0,
        'bisc/',
        '59f116fab83ffbdbfeebb2fc_5a1bb2856bbc6105812c19aa_100lod.mtl',
        '59f116fab83ffbdbfeebb2fc_5a1bb2856bbc6105812c19a9_100lod.obj',
        1,
        0));
    promises.push(newBasset(
        'bisc2',
        0,
        'bisc/',
        '5a0104defbcb3b049f2022ae_5a0104defbcb3b049f2022b1_100lod.mtl',
        '5a0104defbcb3b049f2022ae_5a0104defbcb3b049f2022b0_100lod.obj',
        600,
        -550));
    promises.push(newBasset(
        'bisc3',
        0,
        'bisc/',
        '59f1128ffbcb3b049f20224e_59f1128ffbcb3b049f202251_100lod.mtl',
        '59f1128ffbcb3b049f20224e_59f1128ffbcb3b049f202250_100lod.obj',
        600,
        550));
    Promise.all(promises).then(
            function () {
                console.log(scene.children);
                renderer.render(scene, camera);

                // initialise controls
                var controls = new THREE.PointDragControls();
                controls.init( scene,camera,renderer, {
                    auto_render: true
                });
            }
    );
}
