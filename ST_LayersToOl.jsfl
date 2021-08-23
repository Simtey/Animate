/*ST_layersToOl v1 - Simon Thery - 2021
Nest the selected layers in a symbol over the ongoing symbol  */

an.outputPanel.clear();
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
        var originalTypes = new Array();
        var originalParents = new Array();

        LaySelectedToGuide();
        doc.exitEditMode();

        var tl2 = doc.getTimeline(); // go in the previous timeline

        tl2.duplicateLayers(); // duplicate the current layer
        tl2.setLayerProperty("name", symbolName) // change the layer name
		doc.library.selectNone(); //bugfix if an item is already selected in the library
        var itemSelected = doc.selection[0].libraryItem; // select the symbol in the library
        var selectName = itemSelected.name; // and get its name / path

        doc.library.duplicateItem(selectName); // duplicate the symbol in the library
        doc.library.renameItem(symbolName); // Rename this new symbol
		var libraryItemsSelected = doc.library.getSelectedItems();
		var item2 = libraryItemsSelected[0].name ;
        SwapSymbols();
        doc.library.editItem(item2); // enter in the new symbol
        LayToNormal();
        DeleteNonOl();
	    an.getDocumentDOM().exitEditMode(); // Come back in the previous timeline
        tl2.currentFrame = 0; // select the first frame
        tl2.setSelectedFrames(0, 0);
    }
}

function LaySelectedToGuide() { //turn the selected layers as guide
    var layers = tl.layers;
    var length2 = layers.length;

    for (i = 0; i < length2; i++) { // We restore the layer types
        layer = layers[i];
        originalTypes[i] = layer.layerType;
        originalParents[i] = layer.parentLayer;
    }

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
            doc.swapElement(item2);
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

function LayToNormal() { // put back the guided layers as normal
    var tl3 = doc.getTimeline();
    var numLayer = tl3.layerCount;
    var layers = tl3.layers;

    var layers = tl3.layers;
    var length2 = layers.length;

    for (i = 0; i < length2; i++) { // We restore the layer types
        layer = layers[i];
        layer.layerType = originalTypes[i];
        layer.parentLayer = originalParents[i];
    }
}

function DeleteNonOl() { // delete the non OL layers in the new symbol
    var tl3 = doc.getTimeline();
    if (selLayers.length !== numLayer) { // bugfix if all layers selected
        for each(var k in layToDelete) {
            tl3.setSelectedLayers(k, false);
        }
        doc.getTimeline().deleteLayer();
    }
}