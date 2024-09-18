// 2D RENDER ENGINE

var Engine = Matter.Engine,
Render = Matter.Render,
Runner = Matter.Runner,
Bodies = Matter.Bodies,
Composite = Matter.Composite,
Mouse = Matter.Mouse,
MouseConstraint = Matter.MouseConstraint;

// Add this before creating the engine
function preloadImages(imagePaths, callback) {
    var loadedImages = 0;
    var images = {};

    imagePaths.forEach(function(path) {
        var img = new Image();
        img.onload = function() {
            loadedImages++;
            if (loadedImages === imagePaths.length) {
                callback(images);
            }
        };
        img.src = path;
        images[path] = img;
    });
}

var imagePaths = [
    './BROWSE-ASSETS/PROJECT-IMAGES/Images2/ballpepper.png',
    './BROWSE-ASSETS/PROJECT-IMAGES/Images2/broccoli.png',
    './BROWSE-ASSETS/PROJECT-IMAGES/Images2/cabbage.png',
    './BROWSE-ASSETS/PROJECT-IMAGES/Images2/tomato.png',
    './BROWSE-ASSETS/PROJECT-IMAGES/Images2/tomatoslice.png',
    './BROWSE-ASSETS/PROJECT-IMAGES/Images2/garlicimg.png',
    './BROWSE-ASSETS/PROJECT-IMAGES/Images2/seafoodpizza.png',
    './BROWSE-ASSETS/PROJECT-IMAGES/Images2/pizza-img2.png',
    './BROWSE-ASSETS/PROJECT-IMAGES/Images2/tomato.png',
];

preloadImages(imagePaths, function(images) {
    // Create engine and start animation here
    var engine = Engine.create();
});
// Create engine
var engine = Engine.create();

var container = document.getElementById('matter-container');
var width = window.innerWidth;
var height = window.innerHeight;

// Create renderer
var render = Render.create({
    element: container,
    engine: engine,
    options: {
        width: width,
        height: height,
        wireframes: false,
        background: 'transparent'
    }
});


// Create ground and walls
var ground = Bodies.rectangle(width / 2, height + 25, width, 50, { 
isStatic: true,
render: { visible: false }
});
var leftWall = Bodies.rectangle(-25, height / 2, 50, height, { 
isStatic: true,
render: { visible: false }
});
var rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, { 
isStatic: true,
render: { visible: false }
});

// Create falling objects function
function createObjects() {
var objects = [];
var imagePaths = [
    './BROWSE-ASSETS/PROJECT-IMAGES/Images2/pizza4.png',
    './BROWSE-ASSETS/PROJECT-IMAGES/Images2/pepper.png',
    './BROWSE-ASSETS/PROJECT-IMAGES/Images2/cabbage.png',
    './BROWSE-ASSETS/PROJECT-IMAGES/Images2/tomato.png',
    './BROWSE-ASSETS/PROJECT-IMAGES/Images2/tomatoslice.png',
    './BROWSE-ASSETS/PROJECT-IMAGES/Images2/garlicimg.png',
    './BROWSE-ASSETS/PROJECT-IMAGES/Images2/seafoodpizza.png',
    './BROWSE-ASSETS/PROJECT-IMAGES/Images2/pizza-img2.png',
    './BROWSE-ASSETS/PROJECT-IMAGES/Images2/tomato.png',
    
];
var objectCount = Math.floor((width * height) / 9500); // Adjust density as needed



for (var i = 0; i < objectCount; i++) {
    var x = Math.random() * width;
    var y = Math.random() * -height - 50; // Start above the container
    var size = Math.min(width, height) * 0.05; // 5% of the smaller dimension
    
    var imageIndex = Math.floor(Math.random() * imagePaths.length);
    var object = Bodies.rectangle(x, y, size, size, {
        render: {
            sprite: {
                texture: imagePaths[imageIndex],
                xScale: 0.5, // Adjust these values based on your image sizes
                yScale: 0.5
            }
        }
    });
    objects.push(object);
}

return objects;
}

var objects = createObjects();

// Add mouse control
var mouse = Mouse.create(render.canvas),
mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});

// Add all bodies to the world
Composite.add(engine.world, [ground, leftWall, rightWall, ...objects, mouseConstraint]);

// Run the renderer
Render.run(render);

// Create runner
var runner = Runner.create();

// Run the engine
Runner.run(runner, engine);

// Resize function
function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    

    // Update render canvas size
    render.canvas.width = width;
    render.canvas.height = height;
    render.options.width = width;
    render.options.height = height;

    // Update ground and walls
    Matter.Body.setPosition(ground, Matter.Vector.create(width / 2, height + 25));
    Matter.Body.setPosition(leftWall, Matter.Vector.create(-25, height / 2));
    Matter.Body.setPosition(rightWall, Matter.Vector.create(width + 25, height / 2));

    // Adjust existing objects
    var newSize = Math.min(width, height) * 0.05;
    Composite.allBodies(engine.world).forEach(function(body) {
        if (!body.isStatic) {
            var x = Math.min(Math.max(body.position.x, 0), width);
            var y = Math.min(Math.max(body.position.y, 0), height);
            Matter.Body.setPosition(body, { x: x, y: y });
            
            // Adjust image scale
            if (body.render.sprite) {
                body.render.sprite.xScale = newSize / 100;
                body.render.sprite.yScale = newSize / 100;
            }
        }
    });

    // Remove all objects and create new ones
    Composite.clear(engine.world, false, true);
    objects = createObjects();
    Composite.add(engine.world, [ground, leftWall, rightWall, ...objects, mouseConstraint]);
}

// Make sure to call resizeCanvas initially and add an event listener for resize
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
// Initial call to set up the canvas
resizeCanvas();
