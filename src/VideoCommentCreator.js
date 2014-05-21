"use strict";

/*sugar*/
Array.prototype.contains_ws_ = function() {
	var ret = false, args = arguments;
	for (var k in args) {
		this.forEach(function( val ){
			if ( this.indexOf( args[k] ) >= 0 ) {
				ret = true;
			}
		}, this);
	}
	return ret;
};

Array.prototype.remove_ws_ = function (elem) {
	this.splice(this.indexOf(elem), 1);
};
/*sugar*/

function WS_Subject () {
	this.observerList = [];
}

WS_Subject.prototype.addObserver = function( observer ) {
	this.observerList.push( observer );
};

WS_Subject.prototype.removeObserver = function( observer ) {
	this.observerList.remove_ws_( observer );
};

WS_Subject.prototype.notify = function( context ) {
	for (var i=0; i < this.observerList.length ; i++){
		this.observerList[i].update( context );
	}	
};

function WS_Observer () {
	this.update = function ( context ) {
		// should be created locally whenever needed
	};
}

function WS_DOM_Element ( tag, css, attribs, name, dimensions ) {
	// Instantiate class variables
	this.htmlElement = document.createElement(tag);
	this.applyCss(css);
	this.applyAttributes(attribs);
	this.nameUnique = name;
	this.dimensions = dimensions;
}

function WS_DOM_Animatable ( tag, css, attribs, name, dimensions, animation, placement ) {
	WS_DOM_Element.call( this, tag, css, attribs, name, dimensions ); /* Super call */
	// Instantiate class variables
	this.placement = placement;
	this.animType = animation.type; 
	this.animTimer = [animation.appear, animation.disappear]; // in seconds
	this.animClear = Boolean( true );
}

function WS_DOM_Media ( tag, css, attribs, name, dimensions ) {
	WS_DOM_Element.call( this, tag, css, attribs, name, dimensions); /* Super call */
}

WS_DOM_Animatable.prototype.animate = function() {
	var html = this.htmlElement, aCls = this.animationClass, tCls = this.transitionClass;
	this.transitionend = false;
	if (html.className.indexOf(aCls) === -1) {	
		html.className = ' '+aCls+' '+tCls;
	} else {
		html.className = ' '+tCls;
	}
};

// Creates a style sheet with a class that can then be applied to the element {anim_timer = [start,end]}
WS_DOM_Animatable.prototype.setAnimation = function( anim_class, transform_class, timer ) { 
	this.animTimer = timer;
	this.animationClass = anim_class;
	this.transitionClass = transform_class;

	var html = this.htmlElement;
	html.className = anim_class+' '+transform_class;
	html.addEventListener("transitionend", function(){
		this.transitionend = true;
	});
};

// Don't draw the element bigger than the video. If thats the case, cut down the dimensions of the element
WS_DOM_Animatable.prototype.setMaxSpace = function( maxWidth, maxHeight ) {
	var ms = this.getMaxSpace();
	if (ms[0] > maxWidth) {
		var dif = ms[0] - maxWidth;
		this.dimensions.x = this.dimensions.x - dif;
	}
	if (ms[1] > maxHeight) {
		var dif = ms[1] - maxHeight;
		this.dimensions.y = this.dimensions.x - dif;
	}
};

// Returns the max width and height of this animatable element, i.e. for width: the placement offset plus the width.
WS_DOM_Animatable.prototype.getMaxSpace = function( ) {
	return [this.placement.x + this.dimensions.x, this.placement.y + this.dimensions.y];
};

WS_DOM_Animatable.prototype.checkVideoTimer = function( duration ) {
	var duration_round = Math.round( duration );
	if (this.animTimer[1] > duration_round) {
		this.animTimer[1] = duration_round; 
	}
};

WS_DOM_Element.prototype.setRatio = function() {
	var html = this.htmlElement;
	if ( html instanceof HTMLVideoElement ) {
		this.ratio = [1, html.videoHeight/html.videoWidth];
	} else {
		this.ratio = [1, html.offsetHeight/html.offsetWidth];
	}
};

WS_DOM_Element.prototype.applyCss = function( css ) {
	var html = this.htmlElement;
	for ( var key in css ) {
		html.style[key] = css[key];
	}
};

WS_DOM_Element.prototype.removeCss = function( css ) {
	var html = this.htmlElement;
	for (var key in css) {
		html.style[key] = '';
	}
};

WS_DOM_Element.prototype.applyAttributes = function( attributes ) {
	var html = this.htmlElement;
	for ( var key in attributes ) {
		html.setAttribute(key, attributes[key]);
	}
};

// Somewhat modified function, same as from here: http://www.quirksmode.org/js/findpos.html
WS_DOM_Element.prototype.getPosition = function( ) {
	var html = this.htmlElement;
	var curleft = 0, curtop = 0;
	while (html.offsetParent !== null){
		curleft += html.offsetLeft;
		curtop += html.offsetTop;
		html = html.offsetParent;
	}
	return [curleft, curtop];
};

var video_overlay = {
	// Returns the first instance of an element in the document
	cssSelector : function (selector){
		var ret;
		if ( selector[0] === "#" ) {
			ret = document.getElementById(selector);
		} else if ( selector[0] === "." ) {
			ret = document.getElementsByClassName(selector)[0];
		} else {
			ret = document.getElementsByTagName(selector)[0];			
		}
		// if no object is returned...
		if (ret === undefined) {
			throw new Error("Function 'cssSelector' couldn't find anything to return. Check your hook css selector?");
		}
		return ret;
	},

	extendObj : function( extension, obj ){
		for ( var key in extension ){
			obj[key] = extension[key];
		}
	},
	extendClass : function( sub, base ) {
	  	var origProto = sub.prototype;
		sub.prototype = Object.create(base.prototype);
		for ( var method in origProto ) {
			if ( Object.hasOwnProperty.call(sub.prototype, method) ) {
				throw new Error("Cannot extend: "+sub.toString()+", property is taken");
			} else {
				sub.prototype[method] = origProto[method];
			}
		}
		sub.prototype.constructor = sub;
		Object.defineProperty(sub.prototype, 'constructor', { 
			enumerable: false, 
			value: sub 
		});		
	},
	// Params {classname, cssText}
	makeCss : function ( classnames, css ) {
		var head = document.getElementsByTagName('head')[0],
			cssString = "", stylesheet;
		cssString = classnames+css;
		stylesheet = this.createStyle(cssString);
		head.appendChild(stylesheet);
	},
	// Change naming if class already present in document, quickfix for now
	resolveNaming : function ( naming_json ) {
		var query, clsNames, idName;
		for ( var key in naming_json ) {
			var name = naming_json[key];
			// Returns HTMLCollection object not Array
			clsNames = document.getElementsByClassName(name);
			if ( clsNames[0] !== undefined ) {
				naming_json[key] = name+"alt_";
			}
		}
		return naming_json;
	},
	createStyle : function ( cssText ) {
		var v = document.createElement( 'style' );
		v.type = 'text/css';
			// IE
		if (v.styleSheet) {
			v.styleSheet.cssText = cssText;
		} else {
			v.appendChild( document.createTextNode(cssText) );
		}
		return v;
	},
	// applies naming to animation
	applyNaming : function () {
		for (var key in this.animations) {
			this.animations[key][0] = this.naming.animations[key];
		}
	},
	isEmpty : function ( obj ){
		if(Object.getOwnPropertyNames(obj).length === 0){
			return true;
		} else 
			return false
	},
	// Abstracted naming
	naming : {
		animations : {		
			spin : "ws_spin_",
			fade : "ws_fade_"
		},
		canvas: "ws_cvs_"
	},
	animations: {
		spin : ["", "{ -webkit-transform: scale(0) rotateX(360deg) rotateY(-20deg); }"],
		fade : ["", "{ -webkit-transform: scale(0) rotateX(360deg) rotateY(-20deg); }"]
	},
	elements: {
		// Empty until generated
	},	
	usedAnims : {
		// Generated in init
	},
	generateWsDomElement : function ( elemConf ) {
			var element, 
			setAtr = { 
			},
			setCss = {
				"text-align" : "center",
				width : elemConf.dimensions.x+"px",
				height : elemConf.dimensions.y+"px"
			};
			if (elemConf.background)
				setCss["background"] = elemConf.background;
			if (elemConf.opacity)
				setCss["opacity"] = elemConf.opacity;
			if (elemConf.redirectURL) 
				setAtr["onclick"] = "document.location = '"+elemConf.redirectURL+"'";
			if (elemConf.contentURL) 
				setCss["content"] = "url("+elemConf.contentURL+")";		
			if (elemConf.videoURL) 
				setAtr["src"] = elemConf.videoURL;

		switch ( elemConf.type ) {
			case "animatable":	
				setCss["visibility"] = "hidden";

				element = new WS_DOM_Animatable(  elemConf.tag, setCss, setAtr, elemConf.nameUnique, elemConf.dimensions, elemConf.animation, elemConf.placement )				

				if (elemConf.innerhtml)
					element.innerHTML = elemConf.innerhtml;
				this.extendObj(new WS_Observer(), element);
				break; 

			case "media":
				setCss["visibility"] = "hidden";
				setCss["height"] = undefined;				
			if (elemConf.muted)
				setAtr["muted"] = elemConf.muted;
			if (elemConf.autoplay) 
				setAtr["autoplay"] = elemConf.autoplay;
			if (elemConf.controls) 
				setAtr["controls"] = elemConf.controls;
				// Height resize according to video aspect ratio for media elements, when height is unset standard ratio is applied

				element = new WS_DOM_Media( elemConf.tag, setCss , setAtr, elemConf.nameUnique, elemConf.dimensions );

				this.extendObj(new WS_Subject(), element);
				break;
		}
		return element;
	},
	// Initializes objects, calculates dimensions
	init : function  ( conf ) {
		var names = this.naming, elems = this.elements, anims = this.animations; 
		// Extend some classes
		this.extendClass( WS_DOM_Animatable, WS_DOM_Element );
		this.extendClass( WS_DOM_Media, WS_DOM_Element );
		
		// Fix possible naming errors
		this.resolveNaming( names.animations );
		this.applyNaming();

		// This config is a mess... here im telling to get the config of the envId value
		var contObj = elems[conf["envId"]] = {};
		contObj.container = new WS_DOM_Element( 'div', {}, {id : conf.envId }, conf.envId );
		var wsElem;
		for (var key in conf) {
			if (typeof conf[key] === 'object') {

				wsElem = this.generateWsDomElement ( conf[key] );

				elems[conf["envId"]][key] = wsElem;
				contObj.container.htmlElement.appendChild(wsElem.htmlElement);
			}
		}

		var hookTo = this.cssSelector(conf.hook);
		hookTo.appendChild(contObj.container.htmlElement);

		// quickfix
		for (var key in elems[conf.envId]) {
			if (elems[conf.envId][key] instanceof WS_DOM_Media)
				var media = elems[conf.envId][key];
		}

		// Set dimensions correctly when data for them has finished loading
		media.htmlElement.addEventListener("loadedmetadata", function(){
			// Don't show the video before we know the size
			media.applyCss({visibility : "visible"});
			media.setRatio();
			var mediaWidth = media.htmlElement.offsetWidth;
			var mediaHeight = media.htmlElement.offsetHeight;

			for (var key in elems[conf.envId]) {

				if ( elems[conf.envId][key] instanceof WS_DOM_Element ) 
					elems[conf.envId][key].applyCss({width : mediaWidth+"px", height : mediaHeight+"px", display : "relative"});

				// (if) Calculate the 
				if ( (elems[conf.envId][key] instanceof WS_DOM_Animatable) ) {
					var animatable = elems[conf.envId][key];
					animatable.applyCss({visibility : "visible", position : "absolute"});
					animatable.setMaxSpace(mediaWidth, mediaHeight);
					// Reset the width and height of the animatable element
					if ( animatable.placement.type === "top" ) {
						
					} else if ( animatable.placement.type === "bottom" ) {
						
					} else if ( animatable.placement.type === "right" ) {
						
					} else if ( animatable.placement.type === "left" ) {
						
					}

					animatable.applyCss({ width : animatable.dimensions.x+"px", height : animatable.dimensions.y+"px", "padding-left" : animatable.placement.x+"px", "padding-top" : animatable.placement.y+"px"});

					media.addObserver(animatable);
					
				}
			}

		});

		media.htmlElement.addEventListener("loadedmetadata", function(){ 

		});

	},



};

window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false); //remove listener, no longer needed
	// Execute app last!
	video_overlay.conf = 
	/**
	 * json spec.
	 * @type {{}}
	 */
		{
			envId : String('vidEnv_id_01'),
		 	hook : String('body'), /* Where this element will be hooked */
			overlay1 : {
				/* Generic Variables */
				 type : String('animatable'),
				 nameUnique : String('overlay'), /* name, must be unique */
				 tag : String('div'),  /* default 'div' */
				 dimensions: {x:Number(50), y:Number(50)}, /* in relation to parent element */
				 opacity: Number( 0.5 ),
				/* Generic Variables end */

				 background : String(''), /* BG color */
				/**
				 * Placement types: 'top', 'bottom', 'left', 'right'.
				 * Specifying banner type defaults x and y to null
				 */
				 placement: {x:Number(0), y:Number(0), type:String('bottom')}, /* where on the video would you like to place the element */
				/**
				 * Animation types: 'fade', 'spin' and 'none'.
				 */	
				 animation: {appear:Number(0), disappear:Number(5), type:String('spin')},			 
				 innerhtml: String('<p>htmlstring</p>'), //specify message in overlay
				 contentURL: String('http://placehold.it/350x150'),
				 redirectURL: String('http://google.se') //string to redirect user if he clicks the overlay 
				// makeCanvas: Boolean(false), // <Proposal> Should the overlay contain a canvas?
				// canvasURI: String() // <Proposal> String to the script executed on the canvas, might be intresting with webgl
			},
			video : {
				 /* Generic Variables */
	 			 type : String('media'),
				 nameUnique : String('movie'), /* name, must be unique */
				 tag : String('video'),				 
				 dimensions: {x:Number(200), y:Number(9999)}, /* Resizes itself for media type elements, y value can be safely ignored */
 				 /* Generic Variables end */
				 // overlays : Array('overlay'),  unique name of overlays that appears on video 
				 videoURL: String("mov_bbb.mp4"),
				 autoplay: Boolean(false),
				 muted: Boolean(false),
				 controls: Boolean(false) // defaults false, problems working
			}
		}

video_overlay.init(video_overlay.conf);		


},false);


			
	// overlay: {
	// 	overlay1: /* name, must be unique */ { 
	// 		 opacity: Number(0.5),
	// 		 dimensions: {x:Number(100), y:Number(100)},
	// 		/**
	// 		 * Placement types: 'top', 'bottom', 'left', 'right'.
	// 		 * Specifying banner type defaults x and y to null
	// 		 */
	// 		placement: {x:Number(), y:Number(), type:String()},
	// 		 contentURL: String(),
	// 		 redirectURL: String(), //string to redirect user if he clicks the overlay 
	// 		/**
	// 		 * Animation types: 'fade', 'spin' and 'none'.
	// 		 */
	// 		 animation: {start:Number(), end:Number(), type:String()}, 			 
	// 		// makeCanvas: Boolean(false), // <Proposal> Should the overlay contain a canvas?
	// 		// canvasURI: String() // <Proposal> String to the script executed on the canvas, might be intresting with webgl
	// 	}
	// },
	// video: {
	// 	video1:  /* name, must be unique */  {
	// 		// name of the css selector you want to append this video to
	// 		appendTo : String('body'),
	// 		linkedTo: String(), // Specify the name of the overlay you want to use on this video
	// 		/**
	// 		 * Specified by width, crops the video element to get the correct aspect ratio
	// 		 */
	// 		 dimensions: {x:undefined, y:undefined},		
	// 		 autoplay: Boolean(true),
	// 		 videoURI: String("mov_bbb.mp4"),
	// 		 controls: Boolean(false),
	// 	}
	// },

	// not used
	// generateOverlays : function(json) {
	// 	var elements = {};
	// 	elements[key].addEventListener("loadedmetadata", function(){			
	// 		overlay.checkVideoTimer(video.duration);
	// 		// Apply default dimensions or custom supplied dimensions
	// 		var vid_dimensions = json.video.video1.dimensions || {};
	// 		vid_dimensions.x = vid_dimensions.x || this.videoWidth;
	// 		vid_dimensions.y = vid_dimensions.y || this.videoHeight;
	// 		for (var k in e){
	// 			e[k].applyCss({ width : vid_dimensions.x+"px", height : vid_dimensions.y+"px" });
	// 		}
	// 		// Show the element after pixels have been drawn.
	// 		video.applyCss({visibility:"visible"});
	// 		// Needs to be called when the metadata has finshed loading.
	// 		video.setRatio();
	// 		container.setRatio();
	// 		// Means that the video is wider than longer
	// 		if (video.ratio[1] < container.ratio[1]) {
	// 		}

	// 		overlay.onclick = function (){
	// 			document.location = "https://www.google.se/";
	// 		}
	// 		// [0] = x , [1] = y 
	// 		video.position = video.getPosition();
	// 		console.log("Video y pos: "+video.position[1]);
	// 		var realHeight = video.offsetHeight;
	// 		var bannerOffset = ( realHeight - realHeight/4) + 1 + video.position[1];
	// 		console.log("Banner offset: "+bannerOffset);
	// 		overlay.applyCss({width : video.offsetWidth+"px", height : realHeight/4+"px", top : bannerOffset+"px", position : "absolute", content : "url(http://placehold.it/350x150)"});
	// 		canvas.applyCss({width : video.offsetWidth+"px", height : realHeight/4+"px", top : bannerOffset+"px"});
	// 		console.log("Overlay y pos: "+overlay.getPosition()[1]);
	// 	});
	// 	elements[key].addEventListener("timeupdate", function(){
	// 		var curTime = Math.round(this.currentTime);
	// 		for (var key in e) {
	// 			if ( (e[key].animTimer[0] === curTime || e[key].animTimer[1] === curTime) && e[key].transitionend)  {
	// 				e[key].animate();
	// 			}
	// 		}
	// 	});
	// 	return elements;
	// },
	// Params used mostly for testing
	// main: function  () {
	// 	// animation trying to use a unique name
	// 	makeCss(".ws_transition_ ", "{ -webkit-transition: -webkit-transform 1s ease-in; }");
	// 	var e = this.elements;
	// 	e.video.setAttribute("src", json.video.video1.videoURI);
	// 	// e.video.setAttribute("controls", "");
	// 	e.container.id = "ws_json_video";
	// 	e.overlay.className = "overlay";
	// 	try {		
	// 		for (var k in e){
	// 			extend(new WS_DOM_Element(), e[k]);
	// 		}
	// 	} catch (err) {
	// 		console.log(err.message);
	// 	}
	// 	// To avoid black box appearing. 
	// 	e.video.applyCss({visibility:"hidden"});
	// 	// This is overwritten later when the video duration is known
	// 	e.overlay.setAnimation("ws_rotate_", "ws_transition_", [5,20]);
	// 	e.video.addEventListener("loadedmetadata", function(){
	// 		overlay.checkVideoTimer(video.duration);
	// 		// Apply default dimensions or custom supplied dimensions
	// 		var vid_dimensions = json.video.video1.dimensions || {};
	// 		vid_dimensions.x = vid_dimensions.x || this.videoWidth;
	// 		vid_dimensions.y = vid_dimensions.y || this.videoHeight;
	// 		for (var k in e){
	// 			WS[k].applyCss({ width : vid_dimensions.x+"px", height : vid_dimensions.y+"px" });
	// WS 		}
	// 		// Show the element after pixels have been drawn.
	// 		video.applyCss({visibility:"visible"});
	// 		// Needs to be called when the metadata has finshed loading.
	// 		video.setRatioWS
	// 		container.setRatio();
	// 		// Means that the video is wider than longer
	// 		if (video.ratio[1] < container.ratio[1]) {
	// 		}

	// 		overlay.onclick = function (){document.location = "https://www.google.se/";}
	// 		// [0] = x , [1] = y 
	// 		video.position = video.getPosition();
	// 		console.log("Video y pos: "+video.position[1]);
	// 		var realHeight = video.offsetHeight;
	// 		var bannerOffset = ( realHeight - realHeight/4) + 1 + video.position[1];
	// 		console.log("Banner offset: "+bannerOffset);
	// 		overlay.applyCss({width : video.offsetWidth+"px", height : realHeight/4+"px", top : bannerOffset+"px", position : "absolute", content : "url(http://placehold.it/350x150)"});
	// 		canvas.applyCss({width : video.offsetWidth+"px", height : realHeight/4+"px", top : bannerOffset+"px"});
	// 		console.log("Overlay y pos: "+overlay.getPosition()[1]);
	// 	});
	// 	// To check when to apply animations
	// 	e.video.addEventListener("timeupdate", function(){
	// 		var curTime = Math.round(this.currentTime);
	// 		for (var key in e) {
	// 			if ( (e[key].animTimer[0] === curTime || e[key].animTimer[1] === curTime) && e[key].transitionend)  {
	// 				e[key].animate();
	// 			}
	// 		}
	// 	});