describe("test videoOverlay.js", function() {
	it("should be load the DOMdocument", function() {

		expect(video_overlay.init()).toBe(document);
		
	});
});
