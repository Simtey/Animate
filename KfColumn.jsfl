var doc = (fl.getDocumentDOM());
var tl = doc.getTimeline();
var bkpLay = tl.currentLayer;
var bkpFrame = tl.currentFrame;
var currentFrame = (tl.currentFrame);
layerCount = tl.layerCount;
for (currentLayer = 0; currentLayer < layerCount; currentLayer++) {
	if (tl.layers[currentLayer].layerType != "folder" && tl.layers[currentLayer].locked === false && tl.layers[currentLayer].frames[currentFrame] !== undefined) {
		tl.setSelectedLayers(currentLayer);
		tl.setSelectedFrames(currentFrame, currentFrame);
		if (tl.getFrameProperty('startFrame') != currentFrame && tl.layers[currentLayer].frames[currentFrame].soundLibraryItem == null) {
			tl.convertToKeyframes();
		}
	}
}
tl.setSelectedLayers(bkpLay);
tl.setSelectedFrames(bkpFrame, bkpFrame);