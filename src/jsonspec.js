	/**
	 * json spec.
	 * @type {Object,<String, *>}
	 */
var jsonspec = {
    /**
     * @type {string}
     */
	envId : String('vidEnv_id_01'),
    /**
     * @type {string}
     */
 	hook : String('body'), /* Where this element will be hooked */
    /**
	 * animateble overlay
     * @type {Object.<string, *>}
     */
	overlay1 : {
	    /**
		 * Type variable to describe this overlay 
	     * @type {string}
	     */
		 type : String('animatable'),
		 tag : String('div'),  /* default 'div' */
		 dimensions: {x:Number(100), y:Number(100)}, /* specify minimum width and height of banner */
		 opacity: Number( 0.5 ),

		 background : String(''), /* BG color */
		/**
		 * Placement types: 'top', 'bottom', 'left', 'right'.
		 * Specifying banner type and x or y dimension overrides x and y placement,
		 * the x and y *dimension* can still be modified though depending on where the banner will appear.
		 * @type {number}
		 */
		 placement: {x:Number(100), y:Number(0), type:String('')}, /* where on the video would you like to place the element */
		/**
		 * Animation types: 'fade', 'spin' and 'none'.
		 */	
		 animation: {appear:Number(3), disappear:Number(5), type:String('fade')},			 
		 innerhtml: String('<p>htmlstring</p>'), //specify message in overlay
		 contentURL: String('http://placehold.it/350x150'),
		 redirectURL: String('http://google.se') //string to redirect user if he clicks the overlay 
	}, 
    /**
     * Maximum number of things per pane.
     * @type {number}
     */
	overlay2 : {
	    /**
		 * Type variable to describe this overlay 
	     * @type {string}
	     */
		 type : String('animatable'),
		 tag : String('span'),  /* @type {number} */
		 dimensions: {x:Number(100), y:Number(100)}, /* specify minimum width and height of banner */
		 opacity: Number( 1 ),

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
};