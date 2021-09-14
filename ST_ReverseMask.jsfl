/* Simon Thery 2021
   - select a shape and it make a reversed mask of it                                              */

var doc = an.getDocumentDOM();
var tl = doc.getTimeline();
var curFrame = tl.currentFrame;
var fill = doc.getCustomFill("toolbar");

	doc.clipCut();
	doc.addNewRectangle({left:-192, top:-108, right:2104, bottom:1196}, 0, false, true);
	doc.selectNone();
	doc.clipPaste(true);
	doc.union();
	doc.breakApart();
	doc.deleteSelection();
	tl.setSelectedFrames(curFrame, curFrame);
	doc.selection[0];
	doc.setFillColor('#00ff004C');
	doc.selectNone();
	doc.setFillColor(fill.color);