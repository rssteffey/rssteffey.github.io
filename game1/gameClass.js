/*
	Game1 Testing

*/

var game = new gameClass();

function gameClass(){

//globals
var stage;
var circle;
var hero;
var img= new Image();

	this.firstRun=firstRun;
	function firstRun()
	{
		canvas = document.getElementById('game1');
		canvas.width= canvas.clientWidth;
		canvas.height = canvas.clientHeight;

		//Create a stage by getting a reference to the canvas
		 stage = new createjs.Stage("game1");
		 createjs.Touch.enable(stage);
		 //Create a Shape DisplayObject.
		 //circle = new createjs.Shape();
		 //circle.graphics.beginFill("red").drawCircle(0, 0, 40);
		 //Set position of Shape instance.
		 //circle.x = circle.y = 50;
		 //Add Shape instance to stage display list.
		 //stage.addChild(circle);
		 
			//addBug
			img.onload = onImageLoaded;
			img.src = 'assets/derp.png';
			 
			 document.onkeydown = handleKeyDown;
			 document.onkeyup = handleKeyUp;
			 document.onmousedown = handleKeyDown;
			 document.onmouseup = handleKeyUp;
			 
			
		 

	}
	
	function onImageLoaded(e) {
				 hero = new jscreate.Bitmap(img);
				 hero.x = hero.y = 50;
				 stage.addChild(hero);
				 hero.reset();
				 
				 createjs.Ticker.addEventListener("tick", handleTick);
				 createjs.Ticker.setFPS(30);
			}
	this.resize=resize;
	function resize()
		{
		  canvas.width= canvas.clientWidth;
		  canvas.height = canvas.clientHeight;
		  stage.update();
		}
		
	 this.handleTick = handleTick;
    function handleTick() {
        hero.tick();
        stage.update();
    }	
	 
	 this.handleKeyDown=handlekeyDown;
	 function handleKeyDown(e)
			{
				 hero.reset();
			}
	 this.handleKeyUp=handlekeyUp;	 
	 function handleKeyUp(e)
	 {
	 	 // execute things on KeyUp
	 }
	 
	 //function handlePress(event) {
		  // A mouse press happened.
		  // Listen for mouse move while the mouse is down:
	//	  event.addEventListener("mousemove", handleMove);
	// }
	 
}
/*  //Shawn's code
//General Variables for logic loops
var canvas;
var ctx; 
var rand;
var canvWidth;
var canvHeight;
var opaque;
var key;


//Constants
var fps = 30; //FPS of the animations


	this.firstDraw = firstDraw;
	function firstDraw()
	{
		canvas = document.getElementById('game1');
	  if (canvas.getContext)
	  {
		 ctx = canvas.getContext('2d');
	  }
	  
	  canvas.width= canvas.clientWidth;
	  canvas.height = canvas.clientHeight;
	  
	  //canvHeight = canvas.height;
	  //canvWidth = canvas.width;
	  
	 // logic();
	  //requestAnimationFrame(logic);				
				
		logic();
	}
	
	//resize when user resizes browser
	this.resize = resize;
	function resize()
	{
	  canvas.width= canvas.clientWidth;
	  canvas.height = canvas.clientHeight;
	}
	
	//clear the canvas
	this.clear=clear;
	function clear()
	{
		ctx.clearRect(0,0,canvas.width,canvas.height);
	} 


	var myFunc;

	this.logic=logic;
	//Main Logic Loop for the script
	function logic() {
		 myFunc = setTimeout(function() 
				{
			
				requestAnimationFrame(logic);
				move();
				clear();
				draw();
				
				}, 1000 / fps);
	}
	
	this.draw=draw;
	function draw()
	{
		ctx.beginPath();
		ctx.moveTo(61.921755,48.024272);
		ctx.bezierCurveTo(52.179928,70.755215,42.438096,72.784766,32.696264,81.308866);
		ctx.bezierCurveTo(22.954432,89.832966,14.024419,112.158,14.024419,115.40528);
		ctx.bezierCurveTo(14.024419,118.65256000000001,7.9357744,125.95893000000001,7.9357744,125.95893000000001);
		ctx.stroke();
	}
	
	
	this.move=move;
	function move()
	{
		window.onkeydown = function(e) {
		key = e.keyCode ? e.keyCode : e.which;

		if (key == 38) 
			{
			 player.y++;
			}
		else if (key == 40) 
			{
			 player.y--;
			}
												}
	}
	
	
	
}  
*/


function bug()
{
        

}