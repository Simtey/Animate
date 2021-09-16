/*Simon Thery 2021
Makes a reversed mask of the current selected shape*/
an.outputPanel.clear();
var doc = an.getDocumentDOM();
var tl = doc.getTimeline();
var curLayer = tl.currentLayer;
var curFrame = tl.currentFrame;
var fill = doc.getCustomFill("toolbar");
var selFrames = tl.getSelectedFrames();

	doc.clipCut();
	doc.addNewRectangle({left:0, top:0, right:doc.width, bottom:doc.height}, 0, false, true);
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
	
	for (n=0; n<selFrames.length; n+=3)
{
	layerNum=selFrames[n];
	if(tl.layers[layerNum].layerType == "normal"){
		tl.layers[layerNum].layerType = "mask";
		//tl.setLayerProperty('locked', true);
		tl.layers[layerNum +1 ].layerType = "masked";
		//tl.setSelectedLayers(layerNum +1);
		//tl.setLayerProperty('locked', true);	
	}	
}
