/* 
	Disclaimer to the following disclaimer:  If you are here looking for examples of my coding abilities, turn back now.
	This is not the place to be.  Not even remotely.  Go look at anything else.  My Python code.  My other JS examples.  Maybe just go watch Netflix.
	Just don't try and wade through the following pile of terrible logic and 3AM decision-making.  For your own sake.
 */

/*
	Disclaimer:  This is the first Javascript I have ever written.
	I am trying to be organized -as I am in any language- but the amount of refactoring is
	already immense and my code is still small.  This may be incredibly messy and
	not up to any par.  Apologies in advance.
*/

/*
	Sparknote Version:
		TempPoints move in one of 8 directions. When they reach a gridPoint (%gridSize) they 
		choose whether to drop a node and end the current path segment or not.
		If not dead, they then choose to either continue straight on, drop a node and turn, 
		or turn without placing a node.
		
		These points are constantly rendered with a line connecting them to the last placed point on
		their path.  This lets the user see the circuit being drawn.  The logical choices being made
		only at set gridPoints keeps collision detection at a manageable level (and looks better)

		I'm not even going to try and explain the logic behind the collision detection in condensed
		form because after so much testing and failing and adding two desperate extra lines at a time...
		it's a mess.
		
		All I know is that the function to assign grid spaces as filled is functioning correctly
		(as evidenced by the commented out code that draws yellow dots in full spaces)
		so the issue lies in the way I'm checking for full spaces (or at least when I should be running that call)
		If anyone wants to identify/fix the issue- feel free.  I would love you.

		
		
		
		Special thanks to Eric Moon for helping me remember how to generate noise in Photoshop for the pen effect
*/

//TODO:  resize with Div?

var circuits = new mainWrapper();
function mainWrapper(){

//Enumerating a direction list to reference
var up = new direction(0,-1);
var upRight = new direction(1,-1);
var right = new direction(1,0);
var downRight = new direction(1,1);
var down = new direction(0,1);
var downLeft = new direction(-1,1);
var left = new direction(-1,0);
var upLeft = new direction(-1,-1);

var Directions = [up, upRight, right, downRight, down, downLeft, left, upLeft];

//Setting statistic probability through an array of ints
// 0= continue, 1=turn w/o node, 2= turn and node
var JunctionChoice = [1, 1, 1, 1, 1, 1, 1, 1, 2, 2];
var EndChoice = [0, 0, 0, 1, 1, 1, 1, 1, 1, 1];

//Lists to draw/iterate through
var Grid = [];
var Paths = [];
var Temps = [];

//Other misc vars
var canvas;
var ctx; 
var rand;
var thisRow;
var canvWidth;
var canvHeight;
var tempRanda;
var tempy;
var tempRandb;
var tempx;
var newDir;
var counter=0;
var gridSize = 45;
var  pen;
var mouseOut;
var opaque;

//First method to load the canvas and initiate logic
this.firstDraw = firstDraw;
function firstDraw()
{
	canvas = document.getElementById('code');
	
	canvas.width=canvas.clientHeight;
	canvas.height = canvas.clientHeight;
	mouseOut=false;
	if (canvas.getContext)
	{
		ctx = canvas.getContext('2d');
	}
	//Reset everything
	opaque=0;
	ctx.globalAlpha = 0;
	clear();
	Paths=[];
	Temps=[];
	Grid=[];

//The logic here works on the assumption that both end dots, and the lines between them count as blocks on the grid
//So:
//  O-----O-----O
//takes up 5 horizontal grid spaces.  3 for the points and two for connecting edges
//
//The *2 accounts for this fact
	for (var gridx=0; gridx< canvas.width*2; gridx=gridx+gridSize)
	{
		thisRow = [];
		for (var gridy=0; gridy< canvas.height*2; gridy=gridy+gridSize)
	   {
			var cell = new gridItem();
			
			thisRow.push(cell);
	   }
		Grid.push(thisRow);
	}

	var img = new Image();
	img.src = 'Images/pen.png';
	img.onload = function(){
		pen = ctx.createPattern(img,'repeat');}
  
  canvHeight = canvas.height;
  canvWidth = canvas.width;
  ctx.strokeStyle = pen;
  ctx.fillStyle = pen;
  
  requestAnimationFrame(logic); //Use this rather than setTimeout or setInterval
}  

//Function to catch removed mouse
this.removeMouse = removeMouse;
function removeMouse()
{
	mouseOut=true;
}

//Main Logic Loop for the script
this.logic=logic;
function logic()
{
	if (mouseOut)
	{
		opaque=0;
		opacityWindDown();
		return;
	}
	if (ctx.globalAlpha < 1.0)
	{
		ctx.globalAlpha =  ((ctx.globalAlpha*100)+2)/100;
	}
	clear();
	move();
	draw();
	requestAnimationFrame(logic);
}

//Fade opacity
this.opacityWindDown = opacityWindDown;
function opacityWindDown()
{
	opaque+= 3;
	if (opaque < 100)
	{
		ctx.globalAlpha = (100-opaque)/100;
		clear();
		draw();
		requestAnimationFrame(opacityWindDown);
	}
		return;
}

//Clears the canvas
this.clear=clear;
function clear()
{
	ctx.clearRect(0,0,canvas.width,canvas.height);
} 
 
//Draw all items in the path array 
this.draw=draw;
function draw()
{
ctx.strokeStyle = pen;
ctx.fillStyle = pen;

//Not checked.  Manually ensure paths are at least 2 nodes
	for (var i = 0; i < Paths.length; i++)
	{
		Paths[i][0].drawNode();
		for (var j = 1; j < Paths[i].length; j++)
		{
			Paths[i][j].drawNode();
			ctx.beginPath();
			ctx.moveTo(Paths[i][j].x, Paths[i][j].y);
			ctx.lineTo(Paths[i][j-1].x, Paths[i][j-1].y);
			ctx.closePath();
			ctx.stroke();
		}
	}

	for (var k = 0; k < Temps.length; k++)
	{
		ctx.beginPath();
		ctx.moveTo(Temps[k].x, Temps[k].y);
		//This convoluted enough?  Draws from the current moving point to the last point in the associated path
		ctx.lineTo(Paths[Temps[k].pathIndex][Paths[Temps[k].pathIndex].length-1].x, Paths[Temps[k].pathIndex][Paths[Temps[k].pathIndex].length-1].y);
		ctx.closePath();
		ctx.stroke();
	}
}

//Moves the temp points and runs all logic checks
this.move=move;
function move()
{
	for (var f = 0; f < Temps.length; f++)
	{
		Temps[f].moveBy();
		//If grid location
		if ((Temps[f].x % gridSize == 0) && (Temps[f].y % gridSize == 0))
		{
			junction(Temps[f]);
		}
	}
	
	if (Temps.length < 4)
	{
		do
		{
			passable=false;
			tempRanda = (Math.floor((Math.random()*(canvHeight/gridSize))));
			tempy = tempRanda * gridSize;
			tempRandb = (Math.floor((Math.random()*(canvWidth/gridSize))));
			tempx = tempRandb * gridSize;
			
		}
		while((!Grid[tempRanda*2][tempRandb*2].isEmpty) );
		
		var tempz = new tempPoint(tempx, tempy, 0);
		changeDirection(tempz);
		Temps.push(tempz);
		counter++;
	}
}

//Creates a temp point
this.fakeTemp=fakeTemp;
function fakeTemp(x,y)
{
	this.x=x;
	this.y=y;
}

//Path Point object
this.pathPoint=pathPoint;
function pathPoint(x,y,node)
{
	this.x=x;
	this.y=y;
	this.node=node;
	this.drawNode=drawNode;
	function drawNode()
	{
		if (this.node == true)
		{
			ctx.beginPath();
			ctx.arc(this.x, this.y, 5, 0, Math.PI*2, true); 
			ctx.closePath();
			ctx.fill();
		}		
	}
	if((this.x/(gridSize/2)) < Grid.length && (this.y/(gridSize/2)) < Grid[0].length  && (this.x/(gridSize/2)) >= 0 && (this.y/(gridSize/2)) >= 0)
			{
				Grid[(this.x/(gridSize/2))][(this.y/(gridSize/2))].fill();
			}
}

//TempPoint to track current movers
this.tempPoint=tempPoint;
function tempPoint(x,y, pathInder)
{
	this.x=x;
	this.y=y;
	//Set index to path about to be added
	this.pathIndex=(Paths.length);
	var rand2 = Math.floor((Math.random()*8));
	this.direction= Directions[rand2];
	var newPath = [];
	first = new pathPoint(this.x,this.y,true);
	newPath.push(first);
	Paths.push(newPath);
	this.moveBy = moveBy;
	function moveBy()
		{
			this.x = this.x + this.direction.x;
			this.y = this.y + this.direction.y;
		}
	this.changeDir = changeDir;
	function changeDir(direction)
		{
			this.direction = direction;
		}
}

//Choice to make at grid intersection
this.junction=junction;
function junction(tempor)
{

	fillSpace(tempor);

	//10% chance to just end
	if (Paths[tempor.pathIndex].length >= 2)
	{
		rand = Math.floor((Math.random()*10));
		if (EndChoice[rand] == 0)
		{
			endPath(tempor);
			return;
		}
	}
	//randomly choose junction option
	rand = Math.floor((Math.random()*10));
	if (JunctionChoice[rand] == 1)
	{
		var node = new pathPoint(tempor.x, tempor.y, false);
		Paths[tempor.pathIndex].push(node);
		changeDirection(tempor);
		return;
	}
	//Turn and add node
	if (JunctionChoice[rand] == 2)
	{
		var node = new pathPoint(tempor.x, tempor.y, true)
		Paths[tempor.pathIndex].push(node);
		changeDirection(tempor);
		return;
	}
	
	return;
}

//Count the spaces as filled
this.fillSpace=fillSpace;
function fillSpace(thisTemp)
{
	var numx=thisTemp.x/(gridSize/2);
	var numy=thisTemp.y/(gridSize/2);

//Fill current space
	if((numx) < Grid.length && (numy) < Grid[0].length  && (numx) > 0 && (numy) > 0)
			{
				//document.write((this.x/(gridSize/2)) + " " + (this.y/(gridSize/2)) + ", ");
				Grid[(numx)][(numy)].fill();
			}
//Fill last line
//Reverse direction to figure out previous space
var backwards = new direction((thisTemp.direction.x * -1), (thisTemp.direction.y * -1))

if((numx+backwards.x) < Grid.length && (numy+backwards.y) < Grid[0].length  && (numx+backwards.x) > 0 && (numy+backwards.y) > 0)
			{
				Grid[(numx+backwards.x)][(numy+backwards.y)].fill();
			}
}

//Change the current travel direction
this.changeDirection=changeDirection;
function changeDirection(temporar)
{
	var dirList = generateDirectionList(temporar);
	if (dirList.length==0)
	{
	   //document.write('<b>Hello World</b>');
		endPath(temporar);
		//document.write('<b>Hello World</b>');
		return;
	}
	
	rand = Math.floor((Math.random()*dirList.length));
	temporar.changeDir(dirList[rand]);
	return;
}

//Ends the current path
this.endPath=endPath;
function endPath(tempo)
{
	//Add final node circle to end of path
	var lastNode = new pathPoint(tempo.x, tempo.y, true)
	Paths[tempo.pathIndex].push(lastNode);

	//Remove temp from list of temps being updated
	var i = Temps.indexOf(tempo);
	if(i != -1) 
	{
		Temps.splice(i, 1);
	}
}

//Check to ensure node is not blocked
this.isOpenNeighbor=isOpenNeighbor;
function isOpenNeighbor(ryan, dirToTest)
{
	
	//Check actual emptiness of spots
	var num1 = (ryan.x / (gridSize/2))+dirToTest.x
	var num2 = (ryan.y / (gridSize/2))+dirToTest.y
	var num3 = (ryan.x / (gridSize/2))+(dirToTest.x*2)
	var num4 = (ryan.y / (gridSize/2))+(dirToTest.y*2)
	
	if( (num1<Grid.length && num1>=0) && (num2<Grid.length && num2>=0) && (num3<Grid[0].length && num3>=0) && (num4<Grid[0].length && num4>=0))
	{
		if (Grid[num1][num2].isEmpty)
		{
			if ((Grid[num3][num4]).isEmpty)
			{
				return true;
			}
		}
	}
	return false;
}

//Generate Direction Choice List
this.generateDirectionList=generateDirectionList; 
function generateDirectionList(tempor)
{
	if (tempor.direction == null)
	{
		return Directions;
	}
	var newList = possDir(tempor);
	var newList2 = [];
	for (var i=0; i<newList.length; i++)
	{
		var thisDir = newList[i];
		if (isOpenNeighbor(tempor, thisDir)) //check neighbor!!
		{
			newList2.push(thisDir);
		}
	}
	return newList2;
}

//Return possible new directions based on old direction
this.possDir=possDir;
function possDir(test)
{

	if(test.direction.x == Directions[0].x && test.direction.y == Directions[0].y)
	{
		 return [Directions[7],Directions[0],Directions[1]];
	}
	if(test.direction.x == Directions[1].x && test.direction.y == Directions[1].y)
	{
		return [Directions[0],Directions[1],Directions[2]];
	}
	if(test.direction.x == Directions[2].x && test.direction.y == Directions[2].y)
	{
		return [Directions[1],Directions[2],Directions[3]];
	}
	if(test.direction.x == Directions[3].x && test.direction.y == Directions[3].y)
	{
		return [Directions[2],Directions[3],Directions[4]];
	}
	if(test.direction.x == Directions[4].x && test.direction.y == Directions[4].y)
	{
		return [Directions[3],Directions[4],Directions[5]];
	}
	if(test.direction.x == Directions[5].x && test.direction.y == Directions[5].y)
	{
		return [Directions[4],Directions[5],Directions[6]];
	}
	if(test.direction.x == Directions[6].x && test.direction.y == Directions[6].y)
	{
		return [Directions[5],Directions[6],Directions[7]];
	}
	if(test.direction.x == Directions[7].x && test.direction.y == Directions[7].y)
	{
		return [Directions[6],Directions[7],Directions[0]];
	}
}

//GridItem object for simplicity's sake  (too late)
this.gridItem=gridItem;
function gridItem()
{
	this.isEmpty=true;
	
	this.fill=fill;
	function fill()
	{
		this.isEmpty=false;
	}
}

//Direction to help enumerate
this.direction=direction;
function direction(x,y)
{
	this.x=x;
	this.y=y;
}
};
