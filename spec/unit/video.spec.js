describe("test videoOverlay.js", function() {
	it("should be load the DOMdocument", function() {
		video_overlay.init();
		
		expect(video_overlay.hasrun).toBe(true);
		
	});
});
