"use strict";


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
	// good for css 
	spinner : function  () {
		
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
			fade : "ws_fade_",
			custom : "ws_custom_",
			transform : "ws_transform_"
		},
		canvas: "ws_cvs_"
	},
	animations: {
		spin : [".ws_spin_", " { -webkit-transform: scale(0) rotateX(360deg) rotateY(0deg); }"],
		fade : [".ws_fade_", " { opacity: 0; filter: alpha(opacity=0); } "],
		// Standard transform
		transform : [".ws_transform_", "{ transition: -webkit-transform 1s ease-in-out, opacity 1s ease-in-out; }"]
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
			if (elemConf.videoURL) {
				setAtr["src"] = elemConf.videoURL;
				setAtr["type"] = "video/mp4";
			}

		switch ( elemConf.type ) {
			case "animatable":	
				setCss["z-index"] = 2147483647; 
				setCss["visibility"] = "hidden";

				element = new WS_DOM_Animatable(  elemConf.tag, setCss, setAtr, elemConf.nameUnique, elemConf.dimensions, elemConf.animation, elemConf.placement );				
				element.setAnimation( this.animations[elemConf.animation.type][0], this.animations["transform"][0]);
				
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
				element = new WS_DOM_Media( elemConf.tag, setCss , setAtr, elemConf.nameUnique, elemConf.dimensions );
				this.extendObj(new WS_Subject(), element);
				break;
		}
		return element;
	},
	// Initializes objects, calculates dimensions
	init : function  ( conf ) {
		this.makeCss(this.animations.spin[0], this.animations.spin[1]);				
		this.makeCss(this.animations.transform[0], this.animations.transform[1]);	

		var names = this.naming, elems = this.elements, anims = this.animations; 

		// Extend some classes
		this.extendClass( WS_DOM_Animatable, WS_DOM_Element );
		this.extendClass( WS_DOM_Media, WS_DOM_Element );
		
		// Fix possible naming conflicts
		this.resolveNaming( names.animations );
		this.applyNaming();

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
				 nameUnique : String('overlay'), /* name, must be unique */
				 tag : String('div'),  /* default 'div' */
				 dimensions: {x:Number(50), y:Number(50)}, /* specify minimum width and height of banner */
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
			}, overlay2 : {
				/* Generic Variables */
				 type : String('animatable'),
				 nameUnique : String('overlay'), /* name, must be unique */
				 tag : String('div'),  /* default 'div' */
				 dimensions: {x:Number(50), y:Number(50)}, /* specify minimum width and height of banner */
				 opacity: Number( 1 ),
				/* Generic Variables end */

				 background : String(''), /* BG color */
				/**
				 * Placement types: 'top', 'bottom', 'left', 'right'.
				 * Specifying banner type and x or y dimension overrides x and y placement,
				 * the x and y *dimension* can still be modified though depending on where the banner will appear.
				 */
				 placement: {x:Number(50), y:Number(50), type:String('')}, /* where on the video would you like to place the element */
				/**
				 * Animation types: 'fade', 'spin' and 'none'.
				 */	
				 animation: {appear:Number(0), disappear:Number(5), type:String('spin')},			 
				 innerhtml: String('<p>htmlstring</p>'), //specify message in overlay
				 contentURL: String('http://placehold.it/350x150'),
				 redirectURL: String('http://google.se') //string to redirect user if he clicks the overlay 
				// makeCanvas: Boolean(false), // <Proposal> Should the overlay contain a canvas?
				// canvasURI: String() // <Proposal> String to the script executed on the canvas, might be intresting with webgl
			} ,overlay3 : {
				/* Generic Variables */
				 type : String('animatable'),
				 nameUnique : String('overlay'), /* name, must be unique */
				 tag : String('div'),  /* default 'div' */
				 dimensions: {x:Number(50), y:Number(50)}, /* specify minimum width and height of banner */
				 opacity: Number( 1 ),
				/* Generic Variables end */

				 background : String(''), /* BG color */
				/**
				 * Placement types: 'top', 'bottom', 'left', 'right'.
				 * Specifying banner type and x or y dimension overrides x and y placement,
				 * the x and y *dimension* can still be modified though depending on where the banner will appear.
				 */
				 placement: {x:Number(100), y:Number(100), type:String('')}, /* where on the video would you like to place the element */
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
				 dimensions: {x:Number(400), y:Number(9999)}, /* Resizes itself for media type elements, y value can be safely ignored */
 				 /* Generic Variables end */
				 // overlays : Array('overlay'),  unique name of overlays that appears on video 
				 videoURL: String("http://www.w3schools.com/html/mov_bbb.mp4"),
				 autoplay: Boolean(true),
				 muted: Boolean(false),
				 controls: Boolean(false) // defaults false, problems working
			}
		}

video_overlay.init(video_overlay.conf);		

},false);