//State
var theme = "summer"; //app default, until date overrides

//init elevator.js Elevators
//(I realize this library is probably overkill, but I don't wanna animate scrolling right now)
//(I am part of the left-pad Node problem)
window.onload = function() {
    var aboutElevator = new Elevator({
        element: document.querySelector('.about_link'),
        targetElement: document.querySelector('#about_anchor'),
        duration: 700,
        verticalPadding: 60,
    });
    var projectsElevator = new Elevator({
        element: document.querySelector('.projects_link'),
        targetElement: document.querySelector('#projects_anchor'),
        duration: 700,
        verticalPadding: 60,
    });
    var contactElevator = new Elevator({
        element: document.querySelector('.contact_link'),
        targetElement: document.querySelector('#contact_anchor'),
        duration: 700,
        verticalPadding: 60,
    });

    //Apply correct light overlays
    applyLightOverlay();
}
  
// When the user scrolls the page, execute myFunction
window.onscroll = function() {myFunction()};

// Get the header
var header = document.getElementById("header");
var spacer = document.getElementById("header_spacer");

  // Get the offset position of the navbar
  var header_sticky = header.offsetTop;
  var spacer_sticky = spacer.offsetTop;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {

  if ((window.scrollY ) > header_sticky) {
    header.classList.add("fixed_header");
  } else {
    header.classList.remove("fixed_header");
  }

  if ((window.scrollY ) > spacer_sticky) {
    header.classList.add("solid_background");
  } else {
    header.classList.remove("solid_background");
  }
}


// Date-based eggs

// Define colors that require light overlays here
var lightArray = [
    "summer_color_1",
    "summer_color_2",
    "autumn_color_1",
    "autumn_color_2",
    "winter_color_1",
    "winter_color_4",
    "shawn_color_1",
    "xmas_color_1",
    "xmas_color_2",
    "xmas_color_5"
];

//Apply Light overlay to any colors that may need it
function applyLightOverlay(){
    for(var i = 1; i<=5; i++){
        var a = document.getElementsByClassName( theme + "_color_" + i );
        [...a].forEach( x => x.classList.remove("light") );
        [...a].forEach( x => {
            if(lightArray.includes(theme + "_color_" + i)){
                x.className += " light" 
            }
        });
    }
}

//Seasonal color changes
function swapSeason(newTheme) {
    if(theme === newTheme){
        return;
    }
    var oldTheme = theme;
    for(var i = 1; i<=5; i++){
        var a = document.getElementsByClassName( oldTheme + "_color_text_" + i );
        [...a].forEach( x => x.className += " " + newTheme + "_color_text_" + i);
        [...a].forEach( x => x.classList.remove(oldTheme + "_color_text_" + i) );
        var b = document.getElementsByClassName( oldTheme + "_color_" + i );
        [...b].forEach( x => x.className += " " + newTheme + "_color_" + i);
        [...b].forEach( x => x.classList.remove(oldTheme + "_color_" + i) );
    }
    theme = newTheme;
    applyLightOverlay();
}

