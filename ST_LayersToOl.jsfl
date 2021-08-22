/*ST_layersToOl v1 - Simon Thery - 2021
Nest the selected layers in a symbol over the ongoing symbol */

var doc = an.getDocumentDOM();
var tl = doc.getTimeline();
var symbolName = prompt("Symbol name"); // Ask for a graphic name for the new symbol / layer

if (symbolName != null) { // Abort if cancel or no name provided
    if (doc.library.itemExists(symbolName)) { // check if the symbol name already exists
        alert('This symbol already exists, please chose another name')
    } else {
        var selLayers = tl.getSelectedLayers();
        var numLayer = tl.layerCount;
        var layToDelete = new Array;

        LaySelectedToGuide();
        doc.exitEditMode();

        var tl2 = doc.getTimeline(); // go in the previous timeline

        tl2.duplicateLayers(); // duplicate the current layer
        tl2.setLayerProperty("name", symbolName) // change the layer name

        var itemSelected = doc.selection[0].libraryItem; // select the symbol in the library
        var selectName = itemSelected.name; // and get its name / path

        doc.library.duplicateItem(selectName); // duplicate the symbol in the library
        doc.library.renameItem(symbolName); // Rename this new symbol
        SwapSymbols();
        doc.enterEditMode(); // enter in the new symbol
        DeleteNonOl();
        LaySelectedToNormal();
        doc.exitEditMode(); // Come back in the previous timeline
        tl2.currentFrame = 0; // select the first frame
        tl2.setSelectedFrames(0, 0);
    }
}

function LaySelectedToGuide() { //turn the selected layers as guide
    for (i = 0; i < numLayer; i++) {
        if ((selLayers.indexOf(i) !== -1)) {
            tl.layers[i].layerType = "guide";
        } else {
            layToDelete.push(i); // Create an array of the non-selected layers
        }
    }
}

function SwapSymbols() { // Swap the new symbol on all the keys on the new layer
    var curLayer = tl2.currentLayer;
    var frameArray = tl2.layers[curLayer].frames;
    var tlLength = frameArray.length;
    var currentKf;
	
    for (i = 0; i < tlLength; i++) {
        if (i == frameArray[i].startFrame) {
            currentKf = i;
        }
        tl2.currentFrame = currentKf;
        tl2.setSelectedFrames(currentKf, currentKf + 1);
        doc.selection[0];
        if (doc.selection[0] !== undefined) {
            doc.swapElement(symbolName);
        }
    }
	for (i = 0; i < tlLength; i++) { // loop again to be sure not to be on a blank Kf
        if (i == frameArray[i].startFrame) {
            currentKf = i;
        }
        tl2.currentFrame = currentKf;
        tl2.setSelectedFrames(currentKf, currentKf + 1);
        doc.selection[0];
        if (doc.selection[0] !== undefined) {
            break;
        }
    }
}

function DeleteNonOl() { // delete the non OL layers in the new symbol
    var tl3 = doc.getTimeline();

    if (selLayers.length < numLayer) { // bugfix if all layers selected
        for each(var k in layToDelete) {
            tl3.setSelectedLayers(k, false);
        }
        tl3.deleteLayer();
    }
}

function LaySelectedToNormal() { // put back the guided layers as normal
    var tl3 = doc.getTimeline();
    var numLayer = tl3.layerCount;
    var layers = tl3.layers;

    for (var i = 0; i < numLayer; i++) {
        var currentLayer = layers[i];
        currentLayer.layerType = 'normal';
    }
}