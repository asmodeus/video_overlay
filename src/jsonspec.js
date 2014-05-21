

	{
		overlay: {
 			 type : String('animatable'),
			 name : String('overlay'), /* name, must be unique */
			 tag : String('div'), // default  'div'
			 appearAt : String('movie'),
			/**
			 * Placement types: 'top', 'bottom', 'left', 'right'.
			 * Specifying banner type defaults x and y to null
			 */
			 placement: {x:String('100px'), y:String('100px'), type:String()},
			/**
			 * Animation types: 'fade', 'spin' and 'none'.
			 */	//Timer: appear, goAway
			 animation: {appear:Number(0), goAway:Number(5), type:String('spin')},			 

			 opacity: Number( 0.6 ), //default 0.6
			 message: String('<p>htmlstring</p>'), //specify message in overlay
			 dimensions: {x:String('100px'), y:String('100px')},
			 imgURL: String(''),
			 redirectURL: String('http://google.se') //string to redirect user if he clicks the overlay 
			// makeCanvas: Boolean(false), // <Proposal> Should the overlay contain a canvas?
			// canvasURI: String() // <Proposal> String to the script executed on the canvas, might be intresting with webgl
		},
		video: {
 			 type : String('media'),
			 name : String('movie'), /* name, must be unique */
			 tag : String('video'),
			// name of the css selector you want to append this video to
			 appendTo : String('body'),
			/**
			 * Specified by width, crops the video element to get the correct aspect ratio
			 */
			 width: String('100px'),		
			 videoURL: String("mov_bbb.mp4"),
			 autoplay: Boolean(true),
			 controls: Boolean(false) // defaults false, problems working
		}
	};