an.outputPanel.clear();

var doc = an.getDocumentDOM();
var tl = doc.getTimeline();
var symbolName = prompt("Symbol name");

if (symbolName !== null) {

	if (doc.library.itemExists(symbolName)) {
		alert('This symbol already exists, please chose another name')
	} else {
//an.trace(symbolName);
tl.copyLayers(); // copie les calques selectionnés

var layerArray = tl.getSelectedLayers(); // detecter les layers selectionnés
// an.trace(layerArray);
var selFrames = tl.getSelectedFrames(); //detecte les frames selectionnées

for (n=0; n<selFrames.length; n+=3)
{
	layerNum=selFrames[n];
		tl.layers[layerNum].layerType = "guide";
}

doc.exitEditMode();
var curLayer = fl.getDocumentDOM().getTimeline().currentLayer;
doc.getTimeline().duplicateLayers();
doc.getTimeline().setLayerProperty("name", symbolName)

var select = doc.selection[0].libraryItem ;
var selectName = select.name ;

doc.library.duplicateItem(selectName);
doc.library.renameItem(symbolName);

an.getDocumentDOM().selectNone();
doc.getTimeline().setSelectedLayers(curLayer, true);
doc.getTimeline().setSelectedFrames(0,0);
doc.selection[0];
doc.swapElement(symbolName);

doc.enterEditMode();

var NumLayer = doc.getTimeline().layerCount;
//an.trace(NumLayer);
var lyrs = doc.getTimeline().layers;

			for (var i=0; i < NumLayer; i++) {
				var lyr = lyrs[i];
				lyr.layerType = 'normal';
		}
	}

}