/*
 * Dripping Paint
 * 
 * Shawn Steffey
 *
 * Frankensteined from a script by: Tim Holman
 */

 var arty = new doodleObject2();

function doodleObject2()
{
 
var width = window.innerWidth;
var height = window.innerHeight;
var opacity=1;
var paint;
var totalPaints = width/100;
var size = 20;
var id=0;
var mouse = false;
var level;

var schemeRed;
var schemeBlue;
var schemeGreen;
var colorScheme;

this.init = init;

function init(){
clearInterval(id);
paint = [];
mouse = false;
level=0;
opacity=1;
var c = document.getElementById('artCanvas');
if (c.getContext)
  {
	 ctx = c.getContext('2d');
  }
c.width = width;
c.height = height;

schemeRed = 16 + Math.round(Math.random() * 239);
schemeGreen = 16 +Math.round(Math.random() * 239);
schemeBlue = 16 +Math.round(Math.random() * 239);

colorScheme = ('#' + schemeRed.toString(16) + schemeGreen.toString(16) + schemeBlue.toString(16));

    for (var i = 0; i < totalPaints; i++){
        addPaint();
    }
	
    id = setInterval( update, 40 );
}

this.drawPaint = drawPaint;
function drawPaint(x,y,size, colour) {
	
	//Shadow
	if (!mouse)
		ctx.globalAlpha = .3;
	else if(opacity>.3)
		ctx.globalAlpha = .3;
	else
		ctx.globalAlpha = opacity;
	ctx.beginPath();
	ctx.lineCap="round";
	ctx.moveTo(x+5,y);
	ctx.lineTo(x+5,-100);
	ctx.strokeStyle="#000000";
	ctx.lineWidth = size*2;
	ctx.stroke();
	ctx.globalAlpha = opacity;
	
	//Paint
	ctx.beginPath();
	ctx.lineCap="round";
	ctx.moveTo(x,y);
	ctx.lineTo(x,-100);
	ctx.strokeStyle=colour;
	ctx.lineWidth = size*2;
	ctx.stroke();
	
	
	//Highlight
	ctx.globalAlpha = opacity/3;
	ctx.beginPath();
	ctx.lineCap="round";
	ctx.moveTo(x-(size/2),y);
	ctx.lineTo(x-(size/2),-100);
	ctx.strokeStyle="#FFFFFF";
	ctx.lineWidth = size/2;
	ctx.stroke();
	ctx.globalAlpha = opacity;
		
	if (mouse && level<=0)
	{
		if(opacity <= 0)
		{
			clearInterval(id);
		}
	
		opacity = opacity - .002
		ctx.globalAlpha = opacity;
	}
	
}

this.update=update;
function update(){
	ctx.clearRect(0,0,width,height);
	if (mouse)
		level -= 3;
	
    for (var i = 0; i < paint.length; i++){
        paint[i].y = paint[i].y + paint[i].v;
        if (paint[i].y > (height-level) + 10){
			if(!mouse && level<=height)
				level += paint[i].s * .005;
			
			paint[i].s = paint[i].s-.2;
			if(paint[i].s <= 0)
			{
			   paint.splice(i,1);
			   addPaint();
			}
        }
        drawPaint(paint[i].x, paint[i].y, paint[i].s, paint[i].c);
    }

	ctx.fillStyle=colorScheme;
	ctx.rect(0, height,width, -1*level);
	ctx.fill();
}

//Fade out paint
this.mouseout=mouseout;
function mouseout(){
	mouse=true;
}

this.addPaint=addPaint;
function addPaint(){
	var i = 0;
	var maxTries = 25;
	var conflict;
	var red = schemeRed;
	var green = schemeGreen;
	var blue = schemeBlue;
	var hexRed;
	var hexBlue;
	var hexGreen;
	var random =(Math.round((Math.random() * 64)));
	
	red = red + random;
	if (red > 255 || red<16)
		red = schemeRed;
	blue = blue + random;
	if (blue > 255 || blue<16)
		blue = schemeBlue;
	green = green + random;
	if (green > 255 || green<16)
		green = schemeGreen;

	hexRed   = red.toString(16);
	hexGreen = green.toString(16);
	hexBlue  = blue.toString(16);
	
	
	for (i; i < maxTries; i++) {
		size = Math.random() * size + 10;
		x = Math.random() * width;
		
		conflict = false;
		for (var j = 0; j < paint.length; j++) {
			if ((x + size > paint[j].x) && (x - size < paint[j].x + paint[j].s)) {
				conflict = true;
				break;
			}
			
			if ((x - size < paint[j].x) && (x + size > paint[j].x - paint[j].s)) {
				conflict = true;
				break;
			}
		}
		
		if (conflict == false) {
			paint.push({
				s: size,
				x: x,
				y: -60,
				v: (Math.random() * 3) + 2,
				c: ('#' + hexRed + hexGreen + hexBlue)
			});
			break;
		}
	}
}

};