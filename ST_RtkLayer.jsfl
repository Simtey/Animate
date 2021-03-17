/* prepares the scene to retakes note
   - create 2 layers (a blank one with alpha and another one for the notes
   - select the "note" layer and lock the other one
   - set the brush to red                                                      */

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();
var curLayer = tl.currentLayer;
var curFrame = tl.currentFrame;

	tl.addNewLayer("SbWhite");
	doc.addNewRectangle({left:-192, top:-108, right:2104, bottom:1196}, 0, false, true);
	
//Sets the current layer as selected.

	tl.setSelectedLayers(curLayer);
	tl.setSelectedFrames(0, 0, true);
//Selects current frame.

	tl.setSelectedFrames(curFrame, curFrame, true);

//fill & union
	
	doc.setFillColor('#ffffffbf');
	doc.union();

	tl.addNewLayer("SbNote");
	
var SbNote = tl.findLayerIndex("SbNote");
	tl.setLayerProperty('locked', true, 'all');
	tl.setSelectedLayers(SbNote[0],0);
	tl.setLayerProperty('locked', false);
	
	tl.setSelectedFrames(curFrame, curFrame, true);
	
	fl.selectTool("brush");
		var fill = fl.getDocumentDOM().getCustomFill("toolbar");
	fill.color = "#FF0000";
	fl.getDocumentDOM().setCustomFill(fill);