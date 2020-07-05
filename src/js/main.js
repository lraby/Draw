// Added a closure that emulates private data restricting access to program data and methods (functions) to a non-global scope.
var draw = (function() {

    //Get the height and width of the main we will use this set canvas to the full
    //size of the main element.
    var mWidth = document.querySelector('main').offsetWidth,
      mHeight = document.querySelector('main').offsetHeight,
  
      //Create the canvas
      canvas = document.createElement("canvas"),
  
      //Create the context
      ctx = canvas.getContext("2d"),
  
      //Create the initial bounding rectangle
      rect = canvas.getBoundingClientRect(),
  
    //current x,y position
    //   x=0,
    //   y=0;

    // This gives the starting and ending points of a mouse drag 
    // mousedown provides the starting x,y coordinates or x1,y1
    // mouseup provides the ending x,y coordinates or x2,y2.
    // The 

    //current x,y position
    x=0,
    y=0,

    //starting x,y
    x1=0,
    y1=0,

    //ending x,y
    x2=0,
    y2=0;

    //Tracks the last x,y state
    // Track the previous coordinates i.e lx, ly (shorthand for last-x and last-y).
    lx = false,
    ly = false,

    //What shape are we drawing?
    // Added the shape variable as a private property of the draw object so the object knows what to do when onclick event happens 
    shape='';
    
    // Added a variable called isDrawing, as a private-property
    // This defines whether or not the mouse movement should draw
    isDrawing=false;

    return {
      //Set the x,y coords based on current event data
      setXY: function(evt) {
        
        //Track the last x,y position before setting the current position.
        lx=x;
        ly=y;

      //Set the current x,y position
      x = (evt.clientX - rect.left) - canvas.offsetLeft;
      y = (evt.clientY - rect.top) - canvas.offsetTop;
      },
  
      //Write the x,y coords to the target div
      writeXY: function() {
        document.getElementById('trackX').innerHTML = 'X: ' + x;
        document.getElementById('trackY').innerHTML = 'Y: ' + y;
      },

      // Set the x1,y1
      // Add two methods to set the starting and ending coordinates
      // Added the setter method it's purpose is to set/change the value of a property, typically a private property 
      setStart: function() {
        x1=x;
        y1=y;
      },
      
      // Set the x2, y2
      setEnd: function() {
        x2=x;
        y2=y;
      },

      //Sets the shape to be drawn
      setShape: function(shp) {
        shape = shp;
      },

      // Calls the draw method from our mousemove listener but only if the draw path has been chosen. 
      // Exposes the private path property through a public api called getShape()
      getShape: function() {
        return shape;
      },

      // Created a setter and getter o allow access through a public interface
      setIsDrawing: function(bool) {
        isDrawing = bool;
      },
      
      getIsDrawing: function() {
        return isDrawing;
      },


      // The set shape causes an effect in the draw object 
      draw: function() {
        // Added to reset the grid before the next item is drawn on canvas
        // All future shapes will perform these tasks. 
        ctx.restore();
        if(shape==='rectangle')
        {
          this.drawRect();
        } else if(shape==='line') {
          this.drawLine();
        // Draw a path
        } else if( shape==='path' ) {
        this.drawPath();
        // Added draw circle 
        } else if( shape==='circle' ) {
          this.drawCircle();
        } else {
          alert('Please choose a shape');
        }
        // Added to reset the grid before the next item is drawn on canvas
        ctx.save();
      },

          //Draw a circle
          // Draw a circle in this context it is a 360 degree arc
          // Our starting x,y position (x1, y1) represents the center of the circle
          // our stopping point (x2,y2) rests on the circumference of the circle.
          // With these two points we can use Pythagoreans theorem A2 + B2 = C2 to calculate the radius of the circle.
          // A complete circle the angle will always start where it ends. This is represented as 0 and 2 times pi 2*Math.PI.
          drawCircle: function() {

          ctx.strokeStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
          ctx.fillStyle = '#'+Math.floor(Math.random()*16777215).toString(16);

          let a = (x1-x2)
          let b = (y1-y2)
          let radius = Math.sqrt( a*a + b*b );

          ctx.beginPath();
          ctx.arc(x1, y1, radius, 0, 2*Math.PI);
          ctx.stroke();
          ctx.fill();
        },

        //Draw a line
        // To draw a line you need to begin a path, set x1, y1 and x2, y2, then call the stroke method to draw the line.
        drawLine: function() {
          //Start by using random fill colors.
          ctx.strokeStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        },

        // Added a draw path method that draws from lx,ly to x,y.
        drawPath: function() {
          //Start by using random fill colors.
          ctx.strokeStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          ctx.lineTo(x, y);
          ctx.stroke();
        },

      //Draw a rectangle
      // drawRect: function() {
        //Draw some sample rectangles
        // ctx.fillStyle = "rgb(200,0,0)";
        // ctx.fillRect (10, 10, 55, 50);
      // },
      // drawRect: function(x,y,h,w) {
        drawRect: function() {
        //Start by using random fill colors.
        ctx.fillStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
        ctx.fillRect (x1,y1,(x2-x1),(y2-y1));
      },
  
      getCanvas: function(){
        return canvas;
      },
  
      //Initialize the object, this must be called before anything else
      init: function() {
        canvas.width = mWidth;
        canvas.height = mHeight;
        document.querySelector('main').appendChild(canvas);
      }
    };
  
  })();
  
  //Initialize draw
  draw.init();
  
  //Add a mousemove listener to the canvas (mousemove event tells us where we are on the canvas)
  //When the mouse reports a change of position use the event data to
  //set and report the x,y position on the mouse.
  // Used with mousedown and mouse up events to control when and how the path is drawn
  draw.getCanvas().addEventListener('mousemove', function(evt) {
    draw.setXY(evt);
    draw.writeXY();
    // Called the draw() ftom the mousemove lsitener, now that the draw object has a way to report its shape. 
    if(draw.getShape()=='path' && draw.getIsDrawing()===true) {
      draw.draw();
    }
  }, false);

 //   removed this because I want the user to decide what to draw
    //draw a sample rectangle
    //   draw.drawRect();


  // Added a mousedown listener to the canvas.
  //Set the starting position 
  // When the mousedown listener event is triggered it calls the setStart() method to record the starting position, this defines the top left corner of the triangle. 
  draw.getCanvas().addEventListener('mousedown', function() {
    draw.setStart();
    draw.setIsDrawing(true);
  }, false);

  // Added a mouseup listener to the canvas 
  // Set the end position and draw the rectangle  
  draw.getCanvas().addEventListener('mouseup', function() {
    draw.setEnd();
    // draw.drawRect();
    draw.draw();
    draw.setIsDrawing(false);
  }, false);

  // Added a listener to the canvas 
  // Listens for a click on btnRect
  document.getElementById('btnRect').addEventListener('click',function(){
    draw.setShape('rectangle');
}, false);

  // Added a listener to the canvas 
  document.getElementById('btnLine').addEventListener('click',function(){
    draw.setShape('line');
  }, false);

// Added a listener to the canvas 
  document.getElementById('btnCircle').addEventListener('click', function(){
    draw.setShape('circle');
}, false);

// Added a listener to the canvas 
document.getElementById('btnPath').addEventListener('click', function(){
  draw.setShape('path');
}, false);

