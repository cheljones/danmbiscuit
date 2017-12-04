// two variables the example used, I don't think we need them. TODO findout if we need them

var scene, renderer, camera;

initPDC();
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
    camera.position.set(0, 0, 750);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // The first argument to THREE.PointLight appears to be the color that the biscuit is illuminated with.
    var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( pointLight );

    scene = new THREE.Scene();
    var ambientLight = new THREE.AmbientLight( 0xcccccc, 1 );
    scene.add( ambientLight );

    function newCube(name) {
        var geometry = new THREE.BoxGeometry( 100, 100, 100 );
        var material = new THREE.MeshFaceMaterial([
            new THREE.MeshBasicMaterial({color: 0x00ff00}),
            new THREE.MeshBasicMaterial({color: 0xff0000}),
            new THREE.MeshBasicMaterial({color: 0x0000ff}),
            new THREE.MeshBasicMaterial({color: 0xffff00}),
            new THREE.MeshBasicMaterial({color: 0x00ffff}),
            new THREE.MeshBasicMaterial({color: 0xff00ff})
        ]);
        var cube = new THREE.Mesh( geometry, material );
        cube.name = name
        scene.add(cube);
    }
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

    // newCube('cube');
    newBasset(
        'bisc1',
        20,
        'bisc/',
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

// var container, stats;

// var camera, scene, renderer;

// var mouseX = 0, mouseY = 0;

// var windowHalfX = window.innerWidth / 2;
// var windowHalfY = window.innerHeight / 2;

// init();
// animate();

function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );

    // How far away the camera is from our biscuit
    camera.position.z = 750;

    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
    scene.add( ambientLight );

    // The first argument to THREE.PointLight appears to be the color that the biscuit is illuminated with.
    var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( pointLight );
    scene.add( camera );

    // model

    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };

    var onError = function ( xhr ) { };

    THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( 'bisc/' );
    mtlLoader.load( '59f116fab83ffbdbfeebb2fc_5a1bb2856bbc6105812c19aa_100lod.mtl', function( materials ) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath( 'bisc/' );
        objLoader.load( '59f116fab83ffbdbfeebb2fc_5a1bb2856bbc6105812c19a9_100lod.obj', function ( object ) {

            object.position.y = - 95;
            scene.add( object );

        }, onProgress, onError );

    });

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    document.addEventListener('mousemove', function (event) {
        mouseX = ( event.clientX - windowHalfX ) / 2;
        mouseY = ( event.clientY - windowHalfY ) / 2;
    }, false );

    window.addEventListener('resize', function () {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );
    }, false );
}

function animate() {
    // Do a new render based on camera position.
    camera.position.x += ( mouseX - camera.position.x ) * .05;
    camera.position.y += ( - mouseY - camera.position.y ) * .05;
    camera.lookAt( scene.position );
    renderer.render( scene, camera );

    // Set up the animate function to be called over and over.
    requestAnimationFrame( animate );
}
