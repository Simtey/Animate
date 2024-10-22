/* ST_ExtractShadowLayer - Simon Thery - 2024
- If there is a shadow layer inside a graphic it Exports this shadow layer under the selected layer.
 */

an.outputPanel.clear();
var doc = an.getDocumentDOM();
var tl = doc.getTimeline();
var originalItem = tl.libraryItem.name;
var lib = doc.library
if (tl.getSelectedLayers().length !== 1 || doc.selection[0] === undefined || doc.selection[1] !== undefined) {
	alert("Please select a graphic (only one)")
} else {
	var layerSelected = parseInt(tl.getSelectedLayers());
	var layerSelectedName = tl.layers[layerSelected].name;
	doc.enterEditMode('inPlace');

	checkShadow();

	tl.duplicateLayers();
	tl.setLayerProperty("name", layerSelectedName + "_Shadow") // change the layer name
	lib.selectNone(); //bugfix if an item is already selected in the library
	var selectName = doc.selection[0].libraryItem.name; // get the original symbol name / path
	var copiedSymbolName = selectName.split("/")
	var ShadowSymbolName = copiedSymbolName[1] + "_Shadow";
	if (lib.itemExists(selectName + "_Shadow") == true) { // if the symbol already exists
		alert("The symbol " + ShadowSymbolName + " already exists, please choose another name")
		ShadowSymbolName = prompt(ShadowSymbolName + "_copy");
	}
	lib.duplicateItem(selectName); // duplicate the original symbol in the library
	lib.renameItem(ShadowSymbolName); // Rename this new symbol
	var libraryItemsSelected = doc.library.getSelectedItems();
	var copiedItem = libraryItemsSelected[0].name;

	SwapSymbols();

	tl.reorderLayer(layerSelected + 1, layerSelected);
	lib.editItem(copiedItem); // enter the new symbol

	deleteNonShadow();
	doc.library.editItem(originalItem);
}

function checkShadow() {
	var tl2 = doc.getTimeline();
	var layerShadow = tl2.findLayerIndex("SHADOW"); // Inside the main anim graphic we seek for the layer "SHADOW"
	if (layerShadow === undefined || layerShadow === null || layerShadow.length !== 1) { // If it does'nt exist | more of 1 layer "SHADOW" we abort
		doc.exitEditMode();
		alert('Layer named SHADOW is missing or too many of with this name inside the animation graphic !');
		return;
	} else {
		doc.exitEditMode();
	}
}

function SwapSymbols() { // Swap the new symbol on all the keys on the new layer
	var tl = doc.getTimeline();
	var curLayer = tl.currentLayer;
	var frameArray = tl.layers[curLayer].frames;
	var tlLength = frameArray.length;
	var currentKf;
	for (i = 0; i < tlLength; i++) {
		if (i == frameArray[i].startFrame) {
			currentKf = i;
		}
		tl.currentFrame = currentKf;
		tl.setSelectedFrames(currentKf, currentKf + 1);
		doc.selection[0];
		if (doc.selection[0] !== undefined) {
			doc.swapElement(copiedItem);
		}
	}
}

function deleteNonShadow() {
	var tl3 = doc.getTimeline();
	var layrs = tl3.layers;
	var layLength = layrs.length;
	for (i = 0; i < layLength; i++) {
		var layr = layrs[i];
		if (layr.name != "SHADOW") {
			tl3.layers[i].layerType = "guide";
		} else {
			tl3.layers[i].layerType = "normal";
		}
	}
}