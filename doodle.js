/*
	Doodles Script
	
	-Draws and animates various doodles around the canvas-

*/

var doodler = new doodleObject();

function doodleObject()
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
var Doodles;
var DoodleReference;
var  pen;
var newDoodle;
var timer=0;

//Constants
var DoodleAmount = 4;  //THIS MUST BE MANUALLY UPDATED FOR EACH POSSIBLE NEW DOODLE TYPE ADDED
var fps = 15; //FPS of the animations
var maxVel = 10; //Twice the possible velocity
var emitAmount = 7;
 this.firstDraw = firstDraw;
//First method to load the canvas and initiate logic
function firstDraw()
{
	canvas = document.getElementById('doodle');
	timer=emitAmount-1;
	mouseOut=false;
  if (canvas.getContext)
  {
	 ctx = canvas.getContext('2d');
  }
  
  //var parentDiv = canvas.parentNode;
  canvas.width= document.getElementById('doodleCont').clientWidth;
  canvas.height = document.getElementById('doodleCont').clientHeight;
  
   clear();
	myStopFunction();
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
  ctx.lineWidth=1.5;
  
  canvHeight = canvas.height;
  canvWidth = canvas.width;
  
  emitDoodle();
  emitDoodle();
  emitDoodle();
  
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
	 
		//If Mouse Removed
			if (mouseOut && Doodles.length == 0)
		{
			clear();
			Doodles=[]; //Changed after commmit without test: could be problem.  Also update circuits to resize with div properly.
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
						ctx.rotate(Math.atan(Doodles[k].vely/Doodles[k].velx) + (Math.PI/2));
					}
					ctx.scale(Doodles[k].scale, Doodles[k].scale);
					Doodles[k].draw();
					ctx.restore();
				}
			
			
			}, 1000 / fps);
}

this.myStopFunction=myStopFunction;
function myStopFunction()
{
clearTimeout(myFunc);
}

this.move=move;
function move()
{
	timer++;
	//If more doodles should be on screen
	if ( timer%emitAmount==0 && !mouseOut)//Doodles.length < 6 && !mouseOut)
	{
		emitDoodle();
	}
	
	for (var f = 0; f < Doodles.length; f++)
	{
		Doodles[f].moveBy();
		//If doodle leaves canvas, kill it
		if (Doodles[f].x > canvWidth+(Doodles[f].scale*Doodles[f].width) || Doodles[f].y > canvHeight+(Doodles[f].scale*Doodles[f].height) || Doodles[f].y < 0-(Doodles[f].scale*Doodles[f].height))
		{
			Doodles.splice(f, 1);
		}
	}
}


this.emitDoodle=emitDoodle;
function emitDoodle()
{
	var newDoodleIndex = (Math.floor((Math.random()*(DoodleAmount))));
		var randx=-100//(Math.floor((Math.random()*(canvWidth/2))));
		var randy=(Math.floor((Math.random()*(canvHeight))));
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
			newDoodle = new rocketShip(randx,randy, randvelx, randvely, randScale);
		}
		
		if(newDoodleIndex == 3)
		{
			newDoodle = new superBob(randx,randy, randvelx, randvely, randScale);
		}
		
		Doodles.push(newDoodle);
}


//------------Doodles--------------

//Object to be edited for other Doodles
this.defaultStub=defaultStub;
function defaultStub(x,y, velx, vely, scale)
{
	this.x=x;
	this.y=y;
	//Velocity can be modified per object from here
	this.velx=velx;
	this.vely=vely;
	this.scale=scale;
	this.width=100;
	this.height=100;
	this.frameNum = 3;
	this.frameCount=0;
	//Should object rotate with movement?
	this.directional=false;
	
	this.draw = draw;
	function draw()
		{
			//Any constant lines can be drawn w/o frame checks
		
			if (this.frameCount==0)
			{
				
			}
			
			if (this.frameCount==1)
			{
				
			}
			
			if (this.frameCount==2)
			{
				
			}
			
			//Increase frame for next draw
			this.frameCount++;
			if (this.frameCount==this.frameNum)
			{
				this.frameCount=0;
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
this.bird=bird;
function bird(x,y, velx, vely, scale)
{
	this.x=x;
	this.y=y;
	this.velx=velx;
	this.vely=vely;
	this.width=100;
	this.height=50;
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
this.ufo=ufo;
function ufo(x,y, velx, vely, scale)
{
	this.x=x;
	this.y=y;
	this.velx=velx;
	this.vely=vely;
	this.width=200;
	this.height=200;
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

//Add UFO without beam?


//Rocket Ship  -Directional
this.rocketShip=rocketShip;
function rocketShip(x,y, velx, vely, scale)
{
	this.x=x;
	this.y=y;
	//Velocity can be modified per object from here
	this.velx=velx*5;
	this.vely=vely*5;
	this.width=200;
	this.height=200;
	this.scale=scale/2;
	this.frameNum = 8;
	this.frameCount=0;
	//Should object rotate with movement?
	this.directional=true;
	
	this.draw = draw;
	function draw()
		{
			//Rocket body
				ctx.beginPath();
				ctx.moveTo(38.443591,99.326122);
				ctx.bezierCurveTo(37.517158,40.751118,79.669859,17.800676,79.669859,17.800676);
				ctx.bezierCurveTo(79.669859,17.800676,118.26064,39.074681,117.65361,101.38136999999999);
				ctx.bezierCurveTo(117.62001,104.82381,118.58005,169.5476,118.58005,169.5476);
				ctx.bezierCurveTo(118.58005,169.5476,106.53641999999999,176.05595,80.133077,176.05595);
				ctx.bezierCurveTo(53.729735000000005,176.05595,40.759673,169.89015,40.759673,169.89015);
				ctx.closePath();
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo(40.190383,129.46214);
				ctx.bezierCurveTo(13.787041999999996,131.5174,13.323825999999997,173.65030000000002,13.323825999999997,173.65030000000002);
				ctx.bezierCurveTo(13.323825999999997,173.65030000000002,24.904238999999997,154.46785000000003,40.6536,161.66126000000003);
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo(118.3679,131.90375);
				ctx.bezierCurveTo(143.38159000000002,131.5612,141.06551000000002,172.32393000000002,141.06551000000002,172.32393000000002);
				ctx.bezierCurveTo(141.06551000000002,172.32393000000002,137.82299,161.70507,119.29434000000002,161.70507);
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo(77.855914,130.34378);
				ctx.bezierCurveTo(61.637912,136.81811000000002,71.89099999999999,172.50474000000003,71.370885,175.21702000000002);
				ctx.bezierCurveTo(71.036737,176.95953000000003,76.003049,159.11747000000003,79.245564,163.57053000000002);
				ctx.closePath();
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo(73.580893,54.889771);
				ctx.bezierCurveTo(99.521017,54.547229,99.018878,88.853245,74.931621,89.195787);
				ctx.bezierCurveTo(50.844363,89.538339,55.978667,54.547229,73.580893,54.889771);
				ctx.closePath();
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo(58.825117,36.640589);
				ctx.bezierCurveTo(78.280211,43.834008,97.735303,36.640589,97.735303,36.640589);
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo(66.071429,76.647895);
				ctx.bezierCurveTo(67.5,75.219324,77.142857,62.719324,77.142857,62.719324);
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo(71.071429,84.505038);
				ctx.bezierCurveTo(71.785714,83.076467,86.071429,63.43361,86.071429,63.43361);
				ctx.stroke();
		
			//exhaust for frames
			if (this.frameCount==0 || this.frameCount==4)
			{
					ctx.beginPath();
					ctx.moveTo(63.928572,183.43361);
					ctx.bezierCurveTo(36.785714,208.43361,77.5,240.93361,77.5,240.93361);
					ctx.bezierCurveTo(77.5,240.93361,103.92857000000001,209.1479,90.35714300000001,187.36218);
					ctx.stroke();

					ctx.beginPath();
					ctx.moveTo(70,186.6479);
					ctx.bezierCurveTo(51.428572,204.50504,76.785715,228.79075,76.785715,228.79075);
					ctx.bezierCurveTo(76.785715,228.79075,95.714286,199.50504,79.285714,190.21932);
					ctx.stroke();
			}
			
			if (this.frameCount==1 || this.frameCount==5)
			{
					ctx.beginPath();
					ctx.moveTo(63.928572,183.43361);
					ctx.bezierCurveTo(48.571428000000004,209.50503999999998,86.428571,238.79075,86.428571,238.79075);
					ctx.bezierCurveTo(86.428571,238.79075,97.499999,208.07647,90.35714300000001,187.36218);
					ctx.stroke();

					ctx.beginPath();
					ctx.moveTo(70,186.6479);
					ctx.bezierCurveTo(61.785714999999996,207.00504,80.357144,225.93361,80.357144,225.93361);
					ctx.bezierCurveTo(80.357144,225.93361,88.928572,197.71932999999999,80,184.86218);
					ctx.stroke();
			}
			
			if (this.frameCount==2 || this.frameCount==6)
			{
					ctx.beginPath();
					ctx.moveTo(63.928572,183.43361);
					ctx.bezierCurveTo(37.14285700000001,210.93361,74.642857,244.50503999999998,74.642857,244.50503999999998);
					ctx.bezierCurveTo(74.642857,244.50503999999998,101.78571000000001,219.1479,90.35714300000001,187.36217999999997);
					ctx.stroke();

					ctx.beginPath();
					ctx.moveTo(70,186.6479);
					ctx.bezierCurveTo(43.571428999999995,212.36218,73.214287,234.50504,73.214287,234.50504);
					ctx.bezierCurveTo(73.214287,234.50504,102.85714,199.86219,80,184.86218000000002);
					ctx.stroke();
			}
			
			if (this.frameCount==3 || this.frameCount==7)
			{
					ctx.beginPath();
					ctx.moveTo(63.928572,183.43361);
					ctx.bezierCurveTo(38.214286,214.1479,76.071428,240.21932999999999,76.071428,240.21932999999999);
					ctx.bezierCurveTo(76.071428,240.21932999999999,100.71428,218.07646999999997,90.357143,187.36218);
					ctx.stroke();

					ctx.beginPath();
					ctx.moveTo(70,186.6479);
					ctx.bezierCurveTo(52.500001,208.43361,76.07143,232.00504,76.07143,232.00504);
					ctx.bezierCurveTo(76.07143,232.00504,93.928572,198.43362000000002,80,184.86218000000002);
					ctx.stroke();
			}
			
			//Increase frame for next draw
			this.frameCount++;
			if (this.frameCount==this.frameNum)
			{
				this.frameCount=0;
			}
			//return;
		}
		
	this.moveBy = moveBy;
	function moveBy()
		{
			this.x = this.x + this.velx;
			this.y = this.y + this.vely;
			return;
		}
}

//SuperBob (Directional)

this.superBob=superBob;
function superBob(x,y, velx, vely, scale)
{
	this.x=x;
	this.y=y;
	//Velocity can be modified per object from here
	this.velx=velx*5;
	this.vely=vely*5;
	this.width=100;
	this.height=100;
	this.scale=scale/2;
	this.frameNum = 6;
	this.frameCount=0;
	//Should object rotate with movement?
	this.directional=true;
	
	this.draw = draw;
	function draw()
		{
			//Bob Body
			
			ctx.beginPath();
			ctx.moveTo(62.32767,21.640143);
			ctx.bezierCurveTo(81.405425,21.640143,78.969967,46.287019,63.139486999999995,45.18290399999999);
			ctx.bezierCurveTo(47.342185,44.081102,48.526741,21.234234,62.32767,21.640143);
			ctx.closePath();
			ctx.stroke();
			
			ctx.beginPath();
			ctx.moveTo(63.139487,45.588814);
			ctx.bezierCurveTo(53.803567,90.238876,63.545402,111.75209,63.545402,110.12845);
			ctx.bezierCurveTo(63.545402,108.50482,65.57495,135.29485,65.57495,135.29485);
			ctx.lineTo(59.080396,155.99625);
			ctx.lineTo(65.980859,158.83761);
			ctx.stroke();
			
			ctx.beginPath();
			ctx.moveTo(63.139487,110.94028);
			ctx.lineTo(72.475413,135.70076);
			ctx.lineTo(70.445864,154.37261);
			ctx.lineTo(75.72268700000001,158.43171);
			ctx.stroke();
			
			ctx.beginPath();
			ctx.moveTo(59.892206,61.825203);
			ctx.lineTo(68.416316,43.153355);
			ctx.lineTo(75.316779,9.0569441);
			ctx.stroke();
			
			ctx.beginPath();
			ctx.moveTo(63.95131,21.640143);
			ctx.bezierCurveTo(55.833115,32.193794,57.050844,43.153356,57.050844,43.153356);
			ctx.stroke();
			
			ctx.beginPath();
			ctx.moveTo(68.822224,23.263782);
			ctx.bezierCurveTo(69.63404100000001,46.806543,63.545402,44.776995,63.545402,44.776995);
			ctx.stroke();
			
			ctx.beginPath();
			ctx.moveTo(63.430138,26.806259);
			ctx.bezierCurveTo(60.272897,29.389452000000002,63.286623999999996,32.690199,65.582797,30.82456);
			ctx.bezierCurveTo(67.878969,28.958921,65.726304,24.940620000000003,63.430138,26.806259);
			ctx.closePath();
			ctx.stroke();
			
			ctx.beginPath();
			ctx.moveTo(61.564493,44.745102);
			ctx.lineTo(66.874393,41.157334000000006);
			ctx.lineTo(59.842369,44.31457);
			ctx.lineTo(67.161414,39.148183);
			ctx.bezierCurveTo(67.161414,39.148183,56.541619,43.309994,57.259176,43.309994);
			ctx.bezierCurveTo(57.976724,43.309994,68.022476,36.56499,68.022476,36.56499);
			ctx.lineTo(57.115662,40.583290000000005);
			ctx.lineTo(68.16599,34.69935);
			ctx.lineTo(57.11566199999999,38.000097000000004);
			ctx.lineTo(68.74003099999999,32.403178000000004);
			ctx.bezierCurveTo(68.74003099999999,32.403178000000004,57.40268299999999,34.842861000000006,57.97672399999999,34.986371000000005);
			ctx.bezierCurveTo(58.55077199999999,35.129882,68.74003099999999,30.107006000000005,68.74003099999999,30.107006000000005);
			ctx.lineTo(66.30035199999999,30.107006000000005);
			ctx.lineTo(68.88354499999998,27.954345000000004);
			ctx.stroke();
			
			ctx.beginPath();
			ctx.moveTo(58.120238,33.264243);
			ctx.bezierCurveTo(58.694279,32.977222,62.569069,31.398603,62.569069,31.398603);
			ctx.lineTo(58.9813,30.537539000000002);
			ctx.lineTo(61.851513999999995,28.815410000000004);
			ctx.lineTo(59.985876,28.528388000000003);
			ctx.lineTo(68.883545,23.649023000000003);
			ctx.lineTo(61.133964999999996,26.088705000000004);
			ctx.lineTo(67.735456,22.787959000000004);
			ctx.lineTo(62.138541,24.223066000000003);
			ctx.lineTo(65.582797,22.357427);
			ctx.lineTo(63.573645,22.644448);
			ctx.stroke();
			
			ctx.beginPath();
			ctx.moveTo(68.596524,25.084131);
			ctx.lineTo(65.582797,26.375726999999998);
			ctx.lineTo(68.309497,26.375726999999998);
			ctx.lineTo(66.44385899999999,27.380302999999998);
			ctx.lineTo(68.45301099999999,26.949769999999997);
			ctx.lineTo(66.87439299999998,28.241366999999997);
			ctx.stroke();
			
			//Cape Flapping
			if (this.frameCount==0 || this.frameCount==3)
			{
				ctx.beginPath();
				ctx.moveTo(61.921755,48.024272);
				ctx.bezierCurveTo(52.179928,70.755215,42.438096,72.784766,32.696264,81.308866);
				ctx.bezierCurveTo(22.954432,89.832966,14.024419,112.158,14.024419,115.40528);
				ctx.bezierCurveTo(14.024419,118.65256000000001,7.9357744,125.95893000000001,7.9357744,125.95893000000001);
				ctx.bezierCurveTo(7.9357744,125.95893000000001,27.013528,118.65256000000001,33.913993000000005,121.08801000000001);
				ctx.bezierCurveTo(40.814457000000004,123.52348,49.33856,126.77075,55.83311500000001,123.11756000000001);
				ctx.bezierCurveTo(62.327670000000005,119.46438,62.327670000000005,116.62301000000001,62.327670000000005,116.62301000000001);
				ctx.bezierCurveTo(62.327670000000005,116.62301000000001,53.378248000000006,90.333476,56.644934000000006,74.40839600000001);
				ctx.bezierCurveTo(59.892213000000005,58.57792300000001,61.921755000000005,48.02427200000001,61.921755000000005,48.02427200000001);
				ctx.closePath();
				ctx.stroke();
			}
			
			if (this.frameCount==1 || this.frameCount==4)
			{
				ctx.beginPath();
				ctx.moveTo(61.921755,48.024272);
				ctx.bezierCurveTo(52.179928,70.755215,40.673491,71.902464,38.87238,81.970593);
				ctx.bezierCurveTo(36.592871,94.71294,27.479528,110.3934,21.965139,113.19952);
				ctx.bezierCurveTo(19.071029,114.67226000000001,10.362106,119.56224,10.362106,119.56224);
				ctx.bezierCurveTo(10.362106,119.56224,23.212692,123.29558,31.708237,123.07319);
				ctx.bezierCurveTo(41.467045,122.81774,44.927049,119.27118,51.421604,115.61798999999999);
				ctx.bezierCurveTo(57.916159,111.96480999999999,59.239612,113.97609999999999,59.239612,113.97609999999999);
				ctx.bezierCurveTo(59.239612,113.97609999999999,55.804579000000004,90.99520299999999,56.644934,74.40839599999998);
				ctx.bezierCurveTo(57.462621,58.26900099999998,61.921755,48.02427199999998,61.921755,48.02427199999998);
				ctx.closePath();
				ctx.stroke();
			}
			
			if (this.frameCount==2 || this.frameCount==5)
			{
				ctx.beginPath();
				ctx.moveTo(61.921755,48.024272);
				ctx.bezierCurveTo(52.179928,70.755215,45.696604,75.698293,39.975258,84.176348);
				ctx.bezierCurveTo(31.078482,97.359847,31.784676,106.75475,26.597226,111.6555);
				ctx.bezierCurveTo(21.742182999999997,116.24221,16.09707,122.87087,16.09707,122.87087);
				ctx.bezierCurveTo(16.09707,122.87087,26.080174999999997,121.97211999999999,33.693417,119.54397999999999);
				ctx.bezierCurveTo(42.993990999999994,116.57768999999999,46.614489,113.20754,52.745056999999996,117.16201999999998);
				ctx.bezierCurveTo(58.22393399999999,120.69612999999998,61.224791999999994,111.10861999999999,61.224791999999994,111.10861999999999);
				ctx.bezierCurveTo(61.224791999999994,111.10861999999999,60.657242,95.62728999999999,57.96838699999999,78.59933199999999);
				ctx.bezierCurveTo(55.447807999999995,62.63702099999999,61.92175499999999,48.02427199999999,61.92175499999999,48.02427199999999);
				ctx.closePath();
				ctx.stroke();
			}
			
			//Increase frame for next draw
			this.frameCount++;
			if (this.frameCount==this.frameNum)
			{
				this.frameCount=0;
			}
			//return;
		}
		
	this.moveBy = moveBy;
	function moveBy()
		{
			this.x = this.x + this.velx;
			this.y = this.y + this.vely;
			return;
		}
}




//End brackets for entire script
}

