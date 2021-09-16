/*Simon Thery 2021
Makes a reversed mask of the current selected shape*/
an.outputPanel.clear();
var doc = an.getDocumentDOM();
var tl = doc.getTimeline();
var fill = doc.getCustomFill('toolbar');
var bkpFrame = tl.currentFrame;
var curLayer = tl.currentLayer;
var frameArray = tl.layers[curLayer].frames;
var tlLength = frameArray.length;
var currentKf;

for (i = 0; i < tlLength; i++) {
	if (i == frameArray[i].startFrame) {
		currentKf = i;
	}
	tl.currentFrame = currentKf;
	tl.setSelectedFrames(currentKf, currentKf);
	doc.selection[0];
	if (doc.selection[0] != undefined) {
		doc.clipCut();
		doc.addNewRectangle({left: 0,top: 0,right: doc.width,bottom: doc.height}, 0, false, true);
		doc.selectNone();
		doc.clipPaste(true);
		doc.union();
		doc.breakApart();
		doc.deleteSelection();
		tl.setSelectedFrames(currentKf, currentKf);
		doc.selection[0];
		doc.setFillColor('#00ff004C');
	}
}
doc.setFillColor(fill.color);
doc.selectNone();
tl.currentFrame = bkpFrame;