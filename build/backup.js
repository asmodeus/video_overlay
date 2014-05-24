/**
 * @class
 */
function WS_DOM_Animatable ( tag, css, attribs, dimensions, animation, placement ) {
	WS_DOM_Element.call( this, tag, css, attribs, dimensions ); /* Super call */
	// Instantiate class variables
	this.placement = placement;
	this.animType = animation.type; 
	this.animTimer = [animation.appear, animation.disappear]; // in seconds
	this.animClear = Boolean( true );
	this.tempTime = 0;
}

WS_DOM_Animatable.prototype.animate = function() {
	this.transitionReady = false;
	var html = this.htmlElement, aCls = this.animationClass, tCls = this.transitionClass;
	if ( html.className.indexOf(aCls) === -1 ) {	
		html.className = ' '+aCls+' '+tCls;
	} else {
		html.className = ' '+tCls;
	}
};

// Creates a style sheet with a class that can then be applied to the element {anim_timer = [start,end]}
WS_DOM_Animatable.prototype.setAnimation = function( animationClass, transitionClass ) { 
	this.animationClass = animationClass;
	this.transitionClass = transitionClass;
	var html = this.htmlElement;
	html.className = animationClass+' '+transitionClass;
	this.transitionReady = true;
};

// For custom banner placement, don't draw the banner bigger than the video. If thats the case, cut down the dimensions of the element
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

/*
* @return {[]}
*/
// Returns the max width and height of this animatable element, i.e. for width: the placement offset plus the width.
WS_DOM_Animatable.prototype.getMaxSpace = function(  ) {
	return [this.placement.x + this.dimensions.x, this.placement.y + this.dimensions.y];
};

WS_DOM_Animatable.prototype.checkVideoTimer = function( duration ) {
	var duration_round = Math.round( duration );
	if (this.animTimer[1] > duration_round) {
		this.animTimer[1] = duration_round; 
	}
};
/* ! *//**
 * @class
 */
function WS_DOM_Element ( tag, css, attribs, dimensions ) {
	// Instantiate class variables
	this.htmlElement = document.createElement(tag);
	this.applyCss(css);
	this.applyAttributes(attribs);
	this.dimensions = dimensions;
}


WS_DOM_Element.prototype.setRatio = function(  ) {
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
/* ! *//* Extends WS_DOM_Element */

/**
 * @class
 */
function WS_DOM_Media ( tag, css, attribs, dimensions ) {
	WS_DOM_Element.call( this, tag, css, attribs, dimensions); /* Super call */
}
/* ! */"use strict";


var video_overlay = {
	// Returns the first instance of an element in the document using standard css selectors
	getElementByCssSelector : function ( selector ){
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
			throw new Error("Function 'CssSelector' couldn't find anything to return. Check your hook css selector?");
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
		cssString = classnames+" "+css;
		stylesheet = this.createStyle(cssString);
		head.appendChild(stylesheet);
	},
	// Change naming if class already present in document, quickfix for now
	resolveNaming : function ( naming_json ) {
		var query, clsNames, idName;
		for ( var key in naming_json ) {
			var name1 = naming_json[key]["anim"][0];
			var name2 = naming_json[key]["anim"][0];
			// Returns HTMLCollection object not Array
			clsNames1 = document.getElementsByClassName(name1);
			clsNames2 = document.getElementsByClassName(name2);
			if ( clsNames1[0] !== undefined ) {
				name1 = name1+"alt_";
			}
			if ( clsNames2[0] !== undefined ) {
				name2 = name2+"alt_";
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
	isEmpty : function ( obj ){
		if(Object.getOwnPropertyNames(obj).length === 0){
			return true;
		} else 
			return false
	},
	animations: {
		spin : {
			anim : ["ws_spin_", "{ -webkit-transform: scale(0) rotateX(360deg) rotateY(0deg); }"],
			trans : ["ws_transform_spin_", "{ transition: -webkit-transform 1s ease-in-out; }"]
		}, 
		fade : {
			anim : ["ws_fade_", "{ opacity: 0; filter: alpha(opacity=0); zoom: 0;}"],
			trans : ["ws_transform_fade_", "{ -webkit-transition: opacity 1s ease-in-out; }"]
		}
	},
	elements: {
		// Empty until generated
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
			if (elemConf.videoURL) {
				setAtr["src"] = elemConf.videoURL;
				setAtr["type"] = "video/mp4";
			}

		switch ( elemConf.type ) {
			case "animatable":	
				setCss["z-index"] = 2147483647; 
				setCss["visibility"] = "hidden";

				if (elemConf.animation.type === 'fade')
					setCss["opacity"] = 0+"px";

				element = new WS_DOM_Animatable(  elemConf.tag, setCss, setAtr, elemConf.dimensions, elemConf.animation, elemConf.placement );				
				element.setAnimation( this.animations[elemConf.animation.type]["anim"][0], this.animations[elemConf.animation.type]["trans"][0]);

				// extend first then append update method
				this.extendObj(new WS_Observer(), element);

				element.update = function ( time ) {
					if ( ( time === this.animTimer[0] || time === this.animTimer[1] ) && this.transitionReady ) {
						this.animate();
					};
				};

				element.htmlElement.addEventListener("transitionend", function(){
					element.transitionReady = true;
				});

				element.htmlElement.addEventListener("oTransitionEnd", function(){
					element.transitionReady = true;
				});

				element.htmlElement.addEventListener("webkitTransitionEnd", function(){
					element.transitionReady = true;
				});

				if (elemConf.innerhtml)
					element.innerHTML = elemConf.innerhtml;
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
				element = new WS_DOM_Media( elemConf.tag, setCss , setAtr, elemConf.dimensions );
				this.extendObj(new WS_Subject(), element);
				break;
		}
		return element;
	},
	// Initializes objects, calculates dimensions
	init : function  ( conf ) {

		// Fix possible naming conflicts
		this.resolveNaming( this.animations );

		for (var key in this.animations) {
			this.makeCss("."+this.animations[key]["anim"][0], this.animations[key]["anim"][1]);
			this.makeCss("."+this.animations[key]["trans"][0], this.animations[key]["trans"][1]);
		}
		
		// Extend some classes
		this.extendClass( WS_DOM_Animatable, WS_DOM_Element );
		this.extendClass( WS_DOM_Media, WS_DOM_Element );
		
		var elems = this.elements;
		// This config is a mess... here im setting the local element to key an object to the envId value
		// this is to dynamically create environments, so you could potentially create 3 (or any no.) environments on one page
		var contObj = elems[conf["envId"]] = {};
		contObj.container = new WS_DOM_Element( 'div', {}, {id : conf.envId }, conf.envId );
		var wsElem;
		for (var key in conf) {
			if (typeof conf[key] === 'object') {
				wsElem = this.generateWsDomElement ( conf[key] );
				// applies the object to the local video overlay so it now can be accessed internally
				elems[conf["envId"]][key] = wsElem;
				contObj.container.htmlElement.appendChild(wsElem.htmlElement);
			}
		}

		// where shall we hook this video container?? 
		var hookTo = this.getElementByCssSelector(conf.hook);
		hookTo.appendChild(contObj.container.htmlElement);

		// quickfix, sets media
		for (var key in elems[conf.envId]) {
			if (elems[conf.envId][key] instanceof WS_DOM_Media)
				var media = elems[conf.envId][key];
		}		

		// Set dimensions correctly when data has finished loading
		media.htmlElement.addEventListener( "loadedmetadata", function(){

			// Don't show the video before we know the size
			media.applyCss({ visibility : "visible" });
			media.setRatio();

			var mediaWidth = media.htmlElement.offsetWidth;
			var mediaHeight = media.htmlElement.offsetHeight;

			// goes through the elements in specifed envid
			for (var key in elems[conf.envId]) {

				if ( elems[conf.envId][key] instanceof WS_DOM_Element ) 
					elems[conf.envId][key].applyCss({width : mediaWidth+"px", height : mediaHeight+"px", display : "relative"});

				if ( (elems[conf.envId][key] instanceof WS_DOM_Animatable) ) {
					var animatable = elems[conf.envId][key];
					animatable.applyCss({ visibility : "visible", position : "absolute" });

					// Reset the width and height of the animatable element
					var containerPos = contObj.container.htmlElement.getBoundingClientRect();
					switch ( animatable.placement.type ) {
						case "top":
							var bannerHeight = (animatable.dimensions.y || mediaHeight/4); // int 4 hardcoded, would be good to change depending on which ratio the video has.
							animatable.applyCss({ height : bannerHeight+"px", width : mediaWidth+"px" });
							break;
						case "bottom":
							var bannerHeight = (animatable.dimensions.y || mediaHeight/4);
							animatable.applyCss({ height : bannerHeight+"px", width : mediaWidth+"px", "top" : containerPos.top + (mediaHeight - bannerHeight) + "px" });
							break;
						case "right":
							var bannerWidth = (animatable.dimensions.x || mediaWidth/4)
							animatable.applyCss({ width : bannerWidth+"px", height : mediaHeight+"px", "left" : containerPos.left + (mediaWidth - bannerWidth)+"px" });						
							break;
						case "left":
							var bannerWidth = (animatable.dimensions.x || mediaWidth/4)
							animatable.applyCss({ width : bannerWidth+"px", height : mediaHeight+"px" });						
							break;
	
						default:
							// If no type is set in the placement object, banner gets drawed according to dimensions and placement.
							animatable.setMaxSpace( mediaWidth, mediaHeight );
							animatable.applyCss({ width : animatable.dimensions.x+"px", height : animatable.dimensions.y+"px", "padding-left" : animatable.placement.x+"px", "padding-top" : animatable.placement.y+"px"});
					}
					media.addObserver( animatable );
				}
			}
		});

		media.htmlElement.addEventListener("timeupdate", function(){ 
			// Round the timer so it matches whole numbers
			var curTime = Math.round(this.currentTime);
			media.notify(curTime);
		});

		this.hasrun = true;

	},
	hasrun : Boolean(false)
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
				 tag : String('div'),  /* default 'div' */
				 dimensions: {x:Number(100), y:Number(100)}, /* specify minimum width and height of banner */
				 opacity: Number( 0.5 ),
				/* Generic Variables end */

				 background : String(''), /* BG color */
				/**
				 * Placement types: 'top', 'bottom', 'left', 'right'.
				 * Specifying banner type and x or y dimension overrides x and y placement,
				 * the x and y *dimension* can still be modified though depending on where the banner will appear.
				 */
				 placement: {x:Number(100), y:Number(0), type:String('')}, /* where on the video would you like to place the element */
				/**
				 * Animation types: 'fade', 'spin' and 'none'.
				 */	
				 animation: {appear:Number(3), disappear:Number(5), type:String('fade')},			 
				 innerhtml: String('<p>htmlstring</p>'), //specify message in overlay
				 contentURL: String('http://placehold.it/350x150'),
				 redirectURL: String('http://google.se') //string to redirect user if he clicks the overlay 
				// makeCanvas: Boolean(false), // <Proposal> Should the overlay contain a canvas?
				// canvasURI: String() // <Proposal> String to the script executed on the canvas, might be intresting with webgl
			}, overlay2 : {
				/* Generic Variables */
				 type : String('animatable'),
				 tag : String('span'),  /* default 'div' */
				 dimensions: {x:Number(100), y:Number(100)}, /* specify minimum width and height of banner */
				 opacity: Number( 1 ),
				/* Generic Variables end */

				 background : String(''), /* BG color */
				/**
				 * Placement types: 'top', 'bottom', 'left', 'right'.
				 * Specifying banner type and x or y dimension overrides x and y placement,
				 * the x and y *dimension* can still be modified though depending on where the banner will appear.
				 */
				 placement: {x:Number(0), y:Number(0), type:String('')}, /* where on the video would you like to place the element */
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
				 tag : String('video'),				 
				 dimensions: {x:Number(400), y:Number(9999)}, /* Resizes itself for media type elements, y value can be safely ignored */
 				 /* Generic Variables end */
				 // overlays : Array('overlay'),  unique name of overlays that appears on video 
				 videoURL: String("http://www.w3schools.com/html/mov_bbb.mp4"),
				 autoplay: Boolean(true),
				 muted: Boolean(true),
				 controls: Boolean(false) // defaults false, problems working
			}
		}

video_overlay.init(video_overlay.conf);		

},false);
/* ! *//**
 * @class
 */
function WS_Observer () {
	this.update = function ( context ) {
		// Set this when extending an object with this class
	};
}
/* ! *//**
 * @class
 */
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