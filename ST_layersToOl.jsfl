an.outputPanel.clear();

var doc = an.getDocumentDOM();
var tl = doc.getTimeline();
var symbolName = prompt("Symbol name");

	if (symbolName !== null) {

		if (doc.library.itemExists(symbolName)) {
			alert('This symbol already exists, please chose another name')
		} else {

	tl.copyLayers(); // copie les calques selectionnés

var layerArray = tl.getSelectedLayers(); // detecter les layers selectionnés
var selFrames = tl.getSelectedFrames(); //detecte les frames selectionnées

	for (n=0; n<selFrames.length; n+=3) {
		layerNum=selFrames[n];
		tl.layers[layerNum].layerType = "guide";
	}
	doc.exitEditMode();
	
var tl2 = doc.getTimeline();
var curLayer = tl2.currentLayer;

	tl2.duplicateLayers();
	tl2.setLayerProperty("name", symbolName)

var itemSelected = doc.selection[0].libraryItem ;
var selectName = itemSelected.name ;

	doc.library.duplicateItem(selectName);
	doc.library.renameItem(symbolName);
	doc.selectNone();
	tl2.setSelectedLayers(curLayer, true);
	tl2.setSelectedFrames(0,0);
	doc.selection[0];
	doc.swapElement(symbolName);
	doc.enterEditMode();
	
var tl3 = doc.getTimeline();
var NumLayer = tl3.layerCount;
var layers = tl3.layers;

	for (var i=0; i < NumLayer; i++) {
		var currentLayer = layers [i];
	currentLayer.layerType = 'normal';

	/*	for each(var layToKeep in layerArray){
		if ( i !== layToKeep ) { 	*/
				tl3.setSelectedLayers(i, false);

		}		
	tl3.deleteLayer();
	doc.exitEditMode();	
	}
}
