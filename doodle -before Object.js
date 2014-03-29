/*
	Doodles Script
	
	-Draws and animates various doodles around the canvas-

*/

//General Variables for logic loops
var canvas;
var ctx; 
var rand;
var canvWidth;
var canvHeight;
var mouseOut;
var opaque;

//Doodle Script Specific Variables
var Doodles;
var DoodleReference;
var  pen;
var newDoodle;

//Constants
var DoodleAmount = 3;  //THIS MUST BE MANUALLY UPDATED FOR EACH POSSIBLE NEW DOODLE TYPE ADDED
var fps = 15; //FPS of the animations
var maxVel=10; //Twice the possible velocity
 
//First method to load the canvas and initiate logic
function firstDraw()
{
	canvas = document.getElementById('doodle');
	
	mouseOut=false;
  if (canvas.getContext)
  {
	 ctx = canvas.getContext('2d');
  }
  
  //var parentDiv = canvas.parentNode;
  canvas.width= document.getElementById('doodleCont').clientWidth;
  canvas.height = document.getElementById('doodleCont').clientHeight;
  
   clear();
	Doodles=[];
	DoodleReference = [];
  
 //Creates Pen texture to render on strokes
  var img = new Image();
  img.src = 'Images/pen.png';
  img.onload = function(){
    pen = ctx.createPattern(img,'repeat');
  }
  
  ctx.strokeStyle = pen;//"#253A99";
  ctx.fillStyle = pen;//"#253A99";
  
  canvHeight = canvas.height;
  canvWidth = canvas.width;
  
  logic();
  //requestAnimationFrame(logic);
}  

//Clears the canvas
function clear()
{
	ctx.clearRect(0,0,canvas.width,canvas.height);
} 

//Called when the mouse leaves the button
function removeMouse()
{
	mouseOut=true;
}

var myFunc;

//Main Logic Loop for the script
function logic() {
    myFunc = setTimeout(function() 
			{
	 
		//If Mouse Removed
			if (mouseOut)
		{
			clear();
			//Doodles=[];
			myStopFunction();
			return;
		}
			requestAnimationFrame(logic);
			clear();
			move();
			
			
			//Drawing stuff
			ctx.strokeStyle = pen;//"#253A99";
			ctx.fillStyle = pen;
			for (var k = 0; k < Doodles.length; k++)
				{
					//This right here is a beautiful few lines of code.
					ctx.save();
					ctx.translate(Doodles[k].x, Doodles[k].y);
					if (Doodles[k].directional)
					{
						//Add in rotation based on current direction of movement
					}
					ctx.scale(Doodles[k].scale, Doodles[k].scale);
					Doodles[k].draw();
					ctx.restore();
				}
			
			
			}, 1000 / fps);
}

function myStopFunction()
{
clearTimeout(myFunc);
}


function move()
{
	//If more doodles should be on screen
	if (Doodles.length < 4)
	{
		var newDoodleIndex = (Math.floor((Math.random()*(DoodleAmount))));
		var randx=(Math.floor((Math.random()*(canvWidth/2))));
		var randy=(Math.floor((Math.random()*(canvHeight/2))) + (canvHeight/4));
		var randvelx=(Math.floor((Math.random()*(maxVel))))+3;
		var randvely=(Math.floor((Math.random()*(maxVel))))-(maxVel/2);
		var randScale = (Math.floor((Math.random()*(3))));
		
		//MANUALLY ADD THESE AS NEW DOODLES ARE ADDED
		if(newDoodleIndex == 0)
		{
			newDoodle = new bird(randx,randy, randvelx, randvely, randScale);
		}
		if(newDoodleIndex == 1)
		{
			newDoodle = new ufo(randx,randy, randvelx, randvely, randScale);
			//newDoodle = new ufo(randx,randy);
		}
		if(newDoodleIndex == 2)
		{
			newDoodle = new bird(randx,randy, randvelx, randvely, randScale);
			//newDoodle = new cow(randx,randy);
		}
		
		Doodles.push(newDoodle);
	}
	
	for (var f = 0; f < Doodles.length; f++)
	{
		Doodles[f].moveBy();
		//If doodle leaves canvas, kill it
		if (Doodles[f].x > canvWidth || Doodles[f].x < 0 || Doodles[f].y > canvHeight || Doodles[f].y < 0)
		{
			Doodles.splice(f, 1);
		}
	}
}




//------------Doodles--------------


//Object to be edited for other Doodles
function defaultStub(x,y, velx, vely, scale)
{
	this.x=x;
	this.y=y;
	//Velocity can be modified per object from here
	this.velx=velx;
	this.vely=vely;
	this.scale=scale;
	this.frameNum = 3;
	this.frameCount=0;
	//Should object rotate with movement?
	this.directional=false;
	
	this.draw = draw;
	function draw()
		{
			//Any constant lines can be drawn w/o frame checks
		
			if (frameCount==0)
			{
				
			}
			
			if (frameCount==1)
			{
				
			}
			
			if (frameCount==2)
			{
				
			}
			
			//Increase frame for next draw
			frameCount++;
			if (frameCount==frameNum)
			{
				frameCount=0;
			}
			return;
		}
		
	this.moveBy = moveBy;
	function moveBy()
		{
			this.x = this.x + this.velx;
			this.y = this.y + this.vely;
		}
}


//Derpy Bird
function bird(x,y, velx, vely, scale)
{
	this.x=x;
	this.y=y;
	this.velx=velx;
	this.vely=vely;
	this.scale=scale;
	this.frameNum = 9;
	this.frameCount=0;
	this.directional=false;

	this.draw = draw;
	function draw()
		{
			if (this.frameCount==0 || this.frameCount==1 || this.frameCount==2)
			{
				ctx.beginPath();
				ctx.moveTo(5.3059114,21.341976);
				ctx.bezierCurveTo(14.130911999999999,6.377386399999999,33.933362,20.386796,33.933362,20.386796);
				ctx.bezierCurveTo(33.933362,20.386796,51.798612000000006,5.1038064,60.408372,13.382096);
				ctx.stroke();
			}
			
			if (this.frameCount==3 || this.frameCount==4 || this.frameCount==5)
			{
				ctx.beginPath();
				ctx.moveTo(5.3059114,21.341976);
				ctx.bezierCurveTo(18.171522,14.963683,33.933362,20.386796,33.933362,20.386796);
				ctx.bezierCurveTo(33.933362,20.386796,49.778307,13.185027000000002,60.408372,13.382096);
				ctx.stroke();
			}
			
			if (this.frameCount==6 || this.frameCount==7 || this.frameCount==8)
			{
				ctx.beginPath();
				ctx.moveTo(5.3059114,21.341976);
				ctx.bezierCurveTo(19.181675000000002,24.055056,31.913057,14.325880999999999,31.913057,14.325880999999999);
				ctx.bezierCurveTo(31.913057,14.325880999999999,50.283383,22.2764,60.408372,13.382095999999999);
				ctx.stroke();
			}
			this.frameCount++;
			if (this.frameCount==this.frameNum)
			{
				this.frameCount=0;
			}
		}
		
	this.moveBy = moveBy;
	function moveBy()
		{
			this.x = this.x + this.velx;
			this.y = this.y + this.vely;
		}
	
}

//UFO with beam
function ufo(x,y, velx, vely, scale)
{
	this.x=x;
	this.y=y;
	this.velx=velx;
	this.vely=vely;
	this.scale=scale/2;
	this.frameNum =13;
	this.frameCount=0;
	this.directional=false;

	this.draw = draw;
	function draw()
		{
			//Main Ship (every Frame)
				ctx.beginPath();
				ctx.moveTo(50.507627,57.361925);
				ctx.bezierCurveTo(47.982246,16.955823,98.489873,15.945671,98.489873,15.945671);
				ctx.bezierCurveTo(98.489873,15.945671,136.87567,16.955823000000002,140.91628,47.260399);
				ctx.bezierCurveTo(144.95689,77.564976,50.002551,74.029442,50.507627,57.361925);
				ctx.closePath();
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo(51.012704,55.34162);
				ctx.bezierCurveTo(3.5355339,74.534518,10.101525,78.070052,16.667517,84.636044);
				ctx.bezierCurveTo(23.233508999999998,91.202035,57.073618999999994,100.79848,110.10663000000001,96.252798);
				ctx.bezierCurveTo(163.13964,91.707111,190.41375,62.917764,187.88837,54.836543999999996);
				ctx.bezierCurveTo(185.36299,46.755323,141.92643,45.745171,141.92643,45.745171);
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo(152.53303,61.402535);
				ctx.bezierCurveTo(162.12948,54.836544,171.22086,63.42284,160.10918,68.978679);
				ctx.bezierCurveTo(148.9975,74.534518,140.4112,66.958374,152.53303,61.402535);
				ctx.closePath();
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo(117.32013,76.010694);
				ctx.bezierCurveTo(134.99781000000002,72.475161,134.99782,85.60714300000001,122.87598000000001,86.617296);
				ctx.bezierCurveTo(110.49565000000001,87.64899,105.19830000000002,81.56653299999999,117.32013,76.010694);
				ctx.closePath();
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo(36.00285,72.47516);
				ctx.bezierCurveTo(49.63991,77.020847,46.104384,84.596991,34.992704,82.071609);
				ctx.bezierCurveTo(22.878398,79.318359,28.426707,70.454855,36.00285,72.47516);
				ctx.closePath();
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo(76.914028,79.546228);
				ctx.bezierCurveTo(91.056164,80.051305,92.83886,87.719876,80.449568,88.637601);
				ctx.bezierCurveTo(66.812506,89.64775300000001,64.792198,80.556381,76.914028,79.546228);
				ctx.closePath();
				ctx.stroke();

				//Glass reflections
				ctx.beginPath();
				ctx.moveTo(91.923882,50.795933);
				ctx.bezierCurveTo(99.500026,26.047196,110.6117,24.026891,110.6117,24.026891);
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo(105.56094,52.311162);
				ctx.bezierCurveTo(111.62186,33.118264,119.70308,32.61318800000001,119.70308,32.61318800000001);
				ctx.stroke();
			
		//short beam
			if (this.frameCount==7)
			{
				ctx.beginPath();
				ctx.moveTo(77,105.36218);
				ctx.lineTo(75,137.36218);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(135,103.36218);
				ctx.lineTo(145,129.36218);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(103,108.36218);
				ctx.lineTo(104,135.36218);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(112,107.36218);
				ctx.lineTo(119,133.36218);
				ctx.stroke();
			}
		//Longer beam
			if (this.frameCount>=8)
			{
				ctx.beginPath();
				ctx.moveTo(77,105.36218);
				ctx.lineTo(71,288.36217999999997);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(135,103.36218);
				ctx.lineTo(183,271.36217999999997);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(103,108.36218);
				ctx.lineTo(108,275.36217999999997);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(112,107.36218);
				ctx.lineTo(152,271.36217999999997);
				ctx.stroke();
			}
		//Beam Splatter 1
			if (this.frameCount==9 || this.frameCount==11)
			{
				ctx.beginPath();
				ctx.moveTo(198,260.36218);
				ctx.lineTo(224,244.36218000000002);
				ctx.lineTo(208,276.36218);
				ctx.stroke();
				
				ctx.beginPath();
				ctx.moveTo(49,289.36218);
				ctx.lineTo(17,289.36218);
				ctx.lineTo(45,308.36218);
				ctx.stroke();
				
				ctx.beginPath();
				ctx.moveTo(70,316.36218);
				ctx.lineTo(75,340.36218);
				ctx.lineTo(102,320.36218);
				ctx.stroke();
				
				ctx.beginPath();
				ctx.moveTo(127,319.36218);
				ctx.lineTo(162,330.36218);
				ctx.lineTo(166,307.36218);
				ctx.stroke();
				
				ctx.beginPath();
				ctx.moveTo(185,303.36218);
				ctx.lineTo(215,311.36218);
				ctx.lineTo(202,289.36218);
				ctx.stroke();
				
			}
			
		//Beam Splatter 2
			if (this.frameCount==10 || this.frameCount==12)
			{
				
				ctx.beginPath();
				ctx.moveTo(41,312.36218);
				ctx.lineTo(30,339.36218);
				ctx.lineTo(64,318.36218);
				ctx.stroke();
				
				ctx.beginPath();
				ctx.moveTo(104,323.36218);
				ctx.lineTo(126,348.36218);
				ctx.lineTo(125,321.36218);
				ctx.stroke();
				
				ctx.beginPath();
				ctx.moveTo(171,308.36218);
				ctx.lineTo(199,330.36218);
				ctx.lineTo(185,304.36218);
				ctx.stroke();
				
				ctx.beginPath();
				ctx.moveTo(207,287.36218);
				ctx.lineTo(246,267.36218);
				ctx.lineTo(202,270.36218);
				ctx.stroke();
				
				ctx.beginPath();
				ctx.moveTo(43,277.36218);
				ctx.lineTo(24,244.36218000000002);
				ctx.lineTo(63,264.36218);
				ctx.stroke();
			}
				
		
			
			this.frameCount++;
			if (this.frameCount==this.frameNum)
			{
				this.frameCount=0;
			}
		}
		
	this.moveBy = moveBy;
	function moveBy()
		{
			this.x = this.x + this.velx;
			this.y = this.y + this.vely;
		}
	
}


