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
	var layerSelectedName = tl.layers[layerSelected].name; // gets the name of the selected layer
	doc.enterEditMode('inPlace');

	checkShadow(); // check inside the selected graphic if there is at least one layer Named "SHADOW" in it.

	tl.duplicateLayers();
	tl.setLayerProperty("name", layerSelectedName + "_Shadow") // change the duplicated layer name
	lib.selectNone(); //bugfix if an item is already selected in the library
	var selectName = doc.selection[0].libraryItem.name; // get the original symbol name / path
	var copiedSymbolName = selectName.split("/")
	var ShadowSymbolName = copiedSymbolName[1] + "_Shadow"; // the new name for the duplicated symbol
	if (lib.itemExists(selectName + "_Shadow") == true) { // if the symbol already exists
		alert("The symbol " + ShadowSymbolName + " already exists, please choose another name")
		ShadowSymbolName = prompt("New shadow Symbol name");
	}
	lib.duplicateItem(selectName); // duplicate the original symbol in the library
	lib.renameItem(ShadowSymbolName); // Rename this new symbol
	var libraryItemsSelected = doc.library.getSelectedItems();
	var copiedItem = libraryItemsSelected[0].name;

	SwapSymbols(); // swap the old graphic with the new one (shadow) on each keyframe on the new layer.

	tl.reorderLayer(layerSelected + 1, layerSelected); // move the shadow layer under the character symbol
	lib.editItem(copiedItem); // enter the new symbol

	nonShadowToGuide(); // turn all the layers with a different name than "SHADOW" to guides
	doc.library.editItem(originalItem);
}

function checkShadow() {
	var tl2 = doc.getTimeline();
	var layerShadow = tl2.findLayerIndex("SHADOW"); // Inside the main anim graphic we seek for the layer "SHADOW"
	if (layerShadow === undefined || layerShadow === null) { // If it does'nt exist | more of 1 layer "SHADOW" we abort
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

function nonShadowToGuide() {
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
