"use strict";
/**
 * @type {{}}
 * 
 */

var video_overlay = {

	/**
	 * @param {}
	 */
	init: function (){

	},

	settings: {
		display_time: 5,
		video_url: 'http://www.w3schools.com/html/mov_bbb.mp4',
	},

	/**
	 * @param {document} window.document
	 */
	createOverlayElement: function (document){
		var iDiv = document.createElement('div');
		iDiv.id = 'videoContainer';
		iDiv.appendChild(document.createElement('video'));
		document.getElementsByTagName('body')[0].appendChild(iDiv);
	}

};

video_overlay.createOverlayElement(window.document);
