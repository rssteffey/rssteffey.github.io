
var arty = new ArtObject();

function ArtObject
{
	//General Variables for logic loops
	var canvas;
	var ctx; 
	var rand;
	var canvWidth;
	var canvHeight;
	var mouseOut;
	var opaque;

	//Doodle Script Specific Variables
	var splooshes;
	var  pen;
	var newSploosh;
	var timer=0;

	//Constants
	var fps = 30; //FPS of the animations
	var maxVel = 10; //Twice the possible velocity
	var emitAmount = 7;
	
	this.firstDraw = firstDraw;
	//First method to load the canvas and initiate logic
	function firstDraw()
	{
		canvas = document.getElementById('artCanvas');
		mouseOut=false;
	  if (canvas.getContext)
	  {
		 ctx = canvas.getContext('2d');
	  }
	  
	  canvas.width= document.getElementById('arts').clientWidth;
	  canvas.height = document.getElementById('arts').clientHeight;
	  
		//clear();
		myStopFunction();
		splooshes=[];
	  
	  
	  ctx.strokeStyle = "#253A99";
	  ctx.fillStyle = "#253A99";
	  ctx.lineWidth=4;
	  
	  canvHeight = canvas.height;
	  canvWidth = canvas.width;
	  
	  for (var i = 0; i < emitAmount; i++)
	  {
			emitDoodle();
	  }
	  
	  logic();
	  //requestAnimationFrame(logic);
	}  

	this.clear=clear;
	//Clears the canvas
	function clear()
	{
		ctx.clearRect(0,0,canvas.width,canvas.height);
	} 

	this.removeMouse=removeMouse;
	//Called when the mouse leaves the button
	function removeMouse()
	{
		mouseOut=true;
	}

	var myFunc;

	this.logic=logic;
	//Main Logic Loop for the script
	function logic() {
		 myFunc = setTimeout(function() 
				{
		 
				requestAnimationFrame(logic);
				clear();
				move();
				
				
				//Drawing stuff
				ctx.strokeStyle = "#253A99";
				ctx.fillStyle = "#253A99";
				for (var k = 0; k < splooshes.length; k++)
					{
						//This right here is a beautiful few lines of code.
						ctx.save();
						splooshes[k].draw();
						ctx.restore();
					}
				
				
				}, 1000 / fps);
	}

	this.myStopFunction=myStopFunction;
	function myStopFunction()
	{
	clearTimeout(myFunc);
	}


}