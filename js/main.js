let balls = [ ];
let arrows = [ ];
let direction = 1;
let state;
let right = 0;
let down = 1.5708;
let up = 4.71239;
let left = 3.14159;
let debug = true;
let gridSpace = 150;
let width = 900;
let height = 1500;

function drawHori(space, app) {

    let newLine = new Graphics();
        newLine.lineStyle(4, 0xFFFFFF, 1);
        newLine.moveTo(0, 0);
        newLine.lineTo(800, 0);
 
    newLine.y += space;
    app.stage.addChild(newLine);
}

function drawVert(space, app) {

    let newLine = new Graphics();
        newLine.lineStyle(4, 0xFFFFFF, 1);
        newLine.moveTo(0, 0);
        newLine.lineTo(0, height);
 
    newLine.x += space;
    app.stage.addChild(newLine);
}
function appStart() {
    state = play;
    //Aliases
    let Application = PIXI.Application,
        loader = PIXI.loader,
        resources = PIXI.loader.resources,
        Sprite = PIXI.Sprite;
        Graphics = PIXI.Graphics;
        ParticleContainer = PIXI.particles.ParticleContainer;
        
    //Create a Pixi Application
    let app = new Application({ 
        width: width, 
        height: height,                       
        antialias: true, 
        transparent: false, 
        resolution: 1
      }
    );
    
    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.view);
    
    let line = new Graphics();
        line.lineStyle(4, 0xFFFFFF, 1);
        line.moveTo(0, 0);
        line.lineTo(0, height);
        line.x = 0;
        line.y = 0;
        app.stage.addChild(line);
        space = 0;
        
        while (space < width) {
            space += gridSpace;
            drawVert(space, app);
        }
        
    line = new Graphics();
        line.lineStyle(4, 0xFFFFFF, 1);
        line.moveTo(0, 0);
        line.lineTo(width, 0);
        line.x = 0;
        line.y = 0;
        app.stage.addChild(line);
        space = 0;
        
        while (space < height) {
            space += gridSpace;
            drawHori(space, app);
        }
    //load an image and run the `setup` function when it's done
    loader
      .add(["images/blue-ball-th.png","images/arrow.png"])
      .load(setup);
    
    //This `setup` function will run when the image has loaded
    function setup() {
    
    // create the root of the scene graph
    var stage = new PIXI.Container();
    //stage.interactiveChildren = true;
    var ballsprites = new PIXI.particles.ParticleContainer(10000, {
        scale: true,
        position: true,
        rotation: true,
        uvs: true,
        alpha: true
    });
    
    var arrowsprites = new PIXI.particles.ParticleContainer(10000, {
        scale: true,
        position: true,
        rotation: true,
        uvs: true,
        alpha: true
    });
    
    arrowsprites.interactiveChildren = true;
    arrowsprites.interactive = false;
    stage.addChild(ballsprites);

    stage.addChild(arrowsprites);
    
    totalBalls = 1;
    
    for (var i = 0; i < totalBalls; i++) {
      //Create the sprite
      let ball = new Sprite(resources["images/blue-ball-th.png"].texture);
      
      ball.anchor.set(0.5,0.5);
      ball.scale.set(0.25);
      ball.x = gridSpace;
      ball.vx=0;
      ball.vy=0;
      ball.y = gridSpace;
      ball.zOrder = 100;
      balls.push(ball);
      //Add the cat to the stage
      ballsprites.addChild(ball);
      //app.stage.addChild(ball);
    }
    
    totalArrows = (width/gridSpace)-1;
    totalRows = (height/gridSpace)-1;
    for (var j = 0; j < totalRows; j++)
    for (var i = 0; i < totalArrows; i++) {
        let arrow = new Sprite(resources["images/arrow.png"].texture);
        
        arrow.anchor.set(0.5,0.5);
        arrow.scale.set(0.1);
        if (i==0) arrow.rotation=right;
        else arrow.rotation = left;
        arrow.name=i;
        arrow.x = gridSpace*(i+1);
        arrow.y = gridSpace*(j+1);
        arrow.zOrder = 1000;
        arrow.interactive = true;
        //arrow.buttonMode = true;
        //arrow.on('pointerdown', arrowClick);
        arrow.on('pointerdown', function(event) {
            clickedArrow = event.target;
            if (clickedArrow.rotation==left) {
                clickedArrow.rotation=up;
            } else if (clickedArrow.rotation == up) {
                clickedArrow.rotation=right;
            } else if (clickedArrow.rotation == right) {
                clickedArrow.rotation=down;
            } else if (clickedArrow.rotation== down) {
                clickedArrow.rotation=left;
            }
        });
        arrows.push(arrow);
        app.stage.addChild(arrow);
        //arrowsprites.addChild(arrow);
    }
    app.stage.addChild(stage);
    }
    
    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
    state(delta);
}

function play(delta) {
    for (var i = 0; i < balls.length; i++) {
    var ball = balls[i];
    
    ball = hitCheck(ball);
   // if (ball.x >=100 || ball.x <= 49) direction *= -1;
    if (ball.vx < 0 || ball.vy < 0) delta*=-1;
    if (ball.vx > 0 || ball.vx < 0) ball.x += ball.vx+delta;
    if (ball.vy > 0 || ball.vy < 0) ball.y += ball.vy+delta;
    balls[i] = ball;
    //if (ball.x < 110) console.log(ball.x);
}

function hitCheck(ball) {
    if (ball.x > width || ball.x < 0) {
        ball.vx *= -1;
    } else if (ball.y > height || ball.y < 0) {
        ball.vy *= -1;
    }
    
    for(var i =0;i < arrows.length; i++) {
        var arrow = arrows[i];
        if (Math.abs(ball.x-arrow.x) < 1 && Math.abs(ball.y-arrow.y) < 1) {
            //if (debug) console.log('hit');
            if (arrow.rotation==right) {
                ball.vx=1;
                ball.vy=0;
            } else if (arrow.rotation==left) {
                ball.vx=-1;
                ball.vy=0;
                //console.log(ball.vx);
            } else if (arrow.rotation==up) {
                ball.vx=0;
                ball.vy=-1;
            } else if (arrow.rotation==down) {
                ball.vx=0;
                ball.vy=1;
            }
            //console.log(arrow.rotation);
        }
    }
    return ball;
}

}

function arrowClick(event) {
            //handle event
            console.log('onClick');
            console.log(this);
            /*
            if (arrow.rotation==left) {
                arrow.rotation=up;
            } else if (arrow.rotation == up) {
                arrow.rotation=right;
            } else if (arrow.rotation == right) {
                arrow.rotation=down;
            } else if (arrow.rotation== down) {
                arrow.rotation=left;
            }*/
}