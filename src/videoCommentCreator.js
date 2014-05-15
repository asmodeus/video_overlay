"use strict";

function extend(klass, obj) {
	for ( var k in klass ){
		obj[k] = klass[k];
	}
}

function WS_DOM_Element () {
	this.animationClass = ''; //arr
	this.transitionClass = ''; //arr
	this.animTimer = {}; //json
}

// Two parameters. 
// The time you want the transformation to transform.
// The classname applied to that transformation.
WS_DOM_Element.prototype.animate = function() {
	var aCls = this.animationClass,
		tCls = this.transitionClass;
	if (this.className.indexOf(aCls) === -1) {	
		this.className = ' '+aCls+' '+tCls;
	} else {
		this.className = ' '+tCls;
	}
};

// WS_DOM_Element.prototype.addEventListener = function(event, executethis) {
// 	this.addEventListener(event, executethis);
// };

// Creates a style sheet with a class that can then be applied to the element {anim_timer = [start,end]}
WS_DOM_Element.prototype.setAnimation = function(anim_class, trans_class, timer) { 
	this.animationClass = anim_class;	
	this.transitionClass = trans_class;
	this.className = anim_class+' '+trans_class;
	this.animTimer = timer;
};

WS_DOM_Element.prototype.setRatio = function() {
	if (this instanceof HTMLVideoElement) {
				   //[x, y]
		this.ratio = [1, this.videoHeight/this.videoWidth];
	} else {
		this.ratio = [1, this.offsetWidth/this.offsetHeight];
	}
};

WS_DOM_Element.prototype.applyCss = function(css) {
	for ( var key in css ) {
		this.style[key] = css[key];
	}
};

WS_DOM_Element.prototype.removeCss = function(css) {
	for (var key in css) {
		this.style[key] = '';
	}
};

WS_DOM_Element.prototype.applyAttributes = function(attributes) {
	for ( var key in attributes ) {
		this.setAttribute(key, attributes[key]);
	}
};
// Somewhat modified function, same as from here: http://www.quirksmode.org/js/findpos.html
WS_DOM_Element.prototype.getPosition = function() {
	// thx TGP
	var that = this;
	var curleft = 0, curtop = 0;
	while (that.offsetParent !== null){
		curleft += this.offsetLeft;
		curtop += this.offsetTop;
		that = that.offsetParent;
	}
	return [curleft, curtop];
};

function createStyle (cssText) {
	var v = document.createElement('style');
	v.type = 'text/css';
		// IE
	if (v.styleSheet) {
		v.styleSheet.cssText = cssText;
	} else {
		v.appendChild(document.createTextNode(cssText));
	}
	return v;
};

// Params {classname, cssText}
function makeCss (classnames, css) {
	var head = document.querySelector('head'),
		cssString = "", stylesheet;
	cssString = classnames+css;
	stylesheet = createStyle(cssString);
	head.appendChild(stylesheet);
}
/**
 * An JSON object that can create overlays with canvas or css
 * @type {{}}
 */
var vo = {
	settings : {
		/**
		 * Animations are decided with a start and a end number.
		 * First number: animation start. Second: animation end. Third: type of animation
		 * Animation types: 'fade', 'spin' and 'none'.
		 */
		animation: [], 
		videoURL: String(),
		overlayURL: String(),
		videoAutoplay: Boolean(true),
		vidDim: {x:undefined, y:undefined}		
	},
	elements: {
		container : document.createElement('div'),
		video : document.createElement('video'),
		canvas : document.createElement('canvas'),
		overlay : document.createElement('div')
	},
	// 'Hooks' this script to a certain DOM element or frame
	hook: function  () {
				
	},
	// Params used mostly for testing
	init: function  (videoURL, vid_dimensions, ov_placement, animation, videoAutoplay) {
		// animation trying to use a unique name
		makeCss(".ws_rotate_ ", "{ -webkit-transform: scale(0) rotateX(360deg) rotateY(-20deg); }");
		// transition
		makeCss(".ws_transition_ ", "{ -webkit-transition: -webkit-transform 1s ease-in; }");
		var e = this.elements,
			s = this.settings;
		e.video.setAttribute("src", videoURL);
		e.video.setAttribute("controls", "");
		e.container.id = "ws_json_video";
		e.overlay.className = "overlay";
		// Extend
		for (var k in e){
			extend(new WS_DOM_Element(), e[k]);
			e[k].addEventListener("transitionend", function(){
			});
		}
		// To avoid black box appearing. 
		e.video.applyCss({visibility:"hidden"});
		e.overlay.setAnimation("ws_rotate_", "ws_transition_", [0,5]);
		/*
		 * Sample animated canvas
		 */	
		var pattern= new Image(); 
		function animate(){   
		   pattern.src = '320x40.png'; 
		   setInterval(drawShape, 10);
		}
		function drawShape(){
			// get the canvas element using the DOM
			// Make sure we don't execute when canvas isn't supported
			if (canvas.getContext){
				// use getContext to use the canvas for drawing
				var ctx = canvas.getContext('2d');
				ctx.fillStyle = 'rgba(0,0,0,0.4)';   
				ctx.strokeStyle = 'rgba(0,153,255,0.4)';   
				ctx.save();   
				ctx.translate(150,150); 
				var time = new Date(); 
				ctx.rotate( ((2*Math.PI)/6)*time.getSeconds() + 
				          ( (2*Math.PI)/6000)*time.getMilliseconds() );   
				ctx.translate(0,28.5);   
				ctx.drawImage(pattern,-3.5,-3.5);   
				ctx.restore(); 
			} else {
				alert('You need Safari or Firefox 1.5+ to see this demo.');
			}
		}
		animate();
		e.video.addEventListener("loadedmetadata", function(){
			// Apply default dimensions or custom supplied dimensions
			vid_dimensions = vid_dimensions || {};
			s.vidDim.x = vid_dimensions.x || this.videoWidth;
			s.vidDim.y = vid_dimensions.y || this.videoHeight;
			for (var k in e){
				e[k].applyCss({ width : s.vidDim.x+"px", height : s.vidDim.y+"px" });
			}
			// Show the element after pixels have been drawn.
			video.applyCss({visibility:"visible"});
			// Needs to be called when the metadata has finshed loading.
			video.setRatio();
			container.setRatio();
			// Means that the video is wider than longer
			if (video.ratio[1] < container.ratio[1]) {
				// Gets the actual height of the video element
				var realHeight = video.ratio[1] * container.ratio[1] * container.offsetHeight;
				var emptySpace = video.offsetHeight-realHeight;
				console.log("RealHeight: "+realHeight);
				console.log("Video ratio: ["+video.ratio+"] Container ratio: ["+container.ratio+"]");
			} else if (video.ratio[1] > container.ratio[1]) {
				var realHeight = video.ratio[1] * container.ratio[1] * container.offsetWidth;
				console.log("Video ratio: ["+video.ratio+"] Container ratio: ["+container.ratio+"]");
			}
			overlay.onclick = function (){
				document.location = "https://www.google.se/";
			}
			// [0] = x , [1] = y 
			video.position = video.getPosition();
			console.log("Video y pos: "+video.position[1]);
			var bannerOffset = ( realHeight - realHeight/4) + 1 + video.position[1];
			console.log("Banner offset: "+bannerOffset);
			overlay.applyCss({width : video.offsetWidth+"px", height : realHeight/4+"px", top : bannerOffset+"px", position : "absolute"});
			canvas.applyCss({width : video.offsetWidth+"px", height : realHeight/4+"px", top : bannerOffset+"px"});
			console.log("Overlay y pos: "+overlay.getPosition()[1]);
		});
		e.video.addEventListener("timeupdate", function(){
			var curTime = Math.round(this.currentTime);
			for (var key in e) {
				// Implement this event correctly when an element is transitioned the transitionend event fires, use that event
				if ( e[key].animTimer[0] === curTime || e[key].animTimer[1] === curTime ) {
					e[key].animate();
				}
			}
		});
		e.overlay.addEventListener("transitioned", function () {
			console.log("transition finished");
		});
	},
};

var width = 500;
vo.init('mov_bbb.mp4', {x:width, y:width*0.55});
setTimeout(function(){
	this.video = vo.elements.video,
	this.canvas = vo.elements.canvas,
	this.overlay = vo.elements.overlay,
	this.container = vo.elements.container;
	document.getElementsByTagName('body')[0].appendChild(container);	
	container.appendChild(video);	
	container.appendChild(video);	
	container.appendChild(overlay);
	overlay.appendChild(canvas);	
}, 0);
