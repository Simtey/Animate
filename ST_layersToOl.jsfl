/*
- pourquoi le delete marche ? selection --> probleme si dernier calque = selectionné = supprimé
- Si plusieurs frames dans la tl principale (ex cassé à 2 ) faire le swap sur chaque frame
- si currentFrame = vide sur un calque il n'est pas présent / supprimé ?
- peut être améliorer le prompt

*/


an.outputPanel.clear();

var doc = an.getDocumentDOM();
var tl = doc.getTimeline();
var symbolName = prompt("Symbol name");

	//if (symbolName !== null) {

		if (doc.library.itemExists(symbolName)) {
			alert('This symbol already exists, please chose another name')
		} else {

	tl.copyLayers(); // copie les calques selectionnés

// var layerArray = tl.getSelectedLayers(); // detecter les layers selectionnés
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
	
	
var frameArray = tl2.layers[curLayer].frames;
var n = frameArray.length;
for (i=0; i<n; i++) {
if (i==frameArray[i].startFrame) { /// marche pas  pour résoudre si plusieurs kf main tl
	tl2.setSelectedFrames(i,i+1) ;
	doc.selection[0];
	doc.swapElement(symbolName);
}
}


/*		var frameCount = tl2.layers[curLayer].frameCount;;
	//an.trace(frameCount);
var k = 0;
	for (i = 0; i <= frameCount; i++) { //frames
		tl2.setSelectedFrames(k,k) ;
		doc.selection[0];
		doc.swapElement(symbolName);
				k++;	
			} */
	doc.library.editItem([symbolName]) /// attention si dossier trouver le path
	//doc.enterEditMode();
	
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
//}
