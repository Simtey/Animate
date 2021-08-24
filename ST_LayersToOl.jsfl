/*ST_layersToOl v0.9 - Simon Thery - 2021
Nest the selected layers in a symbol over the ongoing symbol */

an.outputPanel.clear();
var doc = an.getDocumentDOM();
var tl = doc.getTimeline();
// var item0 = tl.libraryItem.name; --> soluce Molang
var symbolName = prompt("Symbol name"); // Ask for a graphic name for the new symbol / layer

if (symbolName != null) { // Abort if cancel or no name provided
    if (doc.library.itemExists(symbolName)) { // check if the symbol name already exists
        alert('This symbol already exists, please chose another name')
    } else {
        var selLayers = tl.getSelectedLayers();
        var numLayer = tl.layerCount;
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
        var item2 = libraryItemsSelected[0].name;
		
        SwapSymbols();
        doc.library.editItem(item2); // enter in the new symbol
        OnlyOls();
		doc.getTimeline().deleteLayer();
        // doc.library.editItem(item0); // soluce Molang
        an.getDocumentDOM().exitEditMode();
        //tl2.currentFrame = 0; // select the first frame
        //tl2.setSelectedFrames(0, 0);
    }
}

function LaySelectedToGuide() { //turn the selected layers as guide
    var layers = tl.layers;
    var length = layers.length;

    for (i = 0; i < length; i++) { // We restore the layer types
        layer = layers[i];
        originalTypes[i] = layer.layerType;
        originalParents[i] = layer.parentLayer;
    }

    for (i = 0; i < numLayer; i++) {
        if ((selLayers.indexOf(i) !== -1)) {
            tl.layers[i].layerType = "guide";
        }
    }
}

function SwapSymbols() { // Swap the new symbol on all the keys on the new layer
    var tl2 = doc.getTimeline();
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

function OnlyOls() {
    var layers = doc.getTimeline().layers;
    var length2 = layers.length;
    //an.trace(length2);
    for (i = 0; i < length2; i++) {
        var currentLayer = layers[i];
		
        doc.getTimeline().layers[i].layerType = "normal";
		
        if ((selLayers.indexOf(i) !== -1)) {
            currentLayer.layerType = originalTypes[i];
            currentLayer.parentLayer = originalParents[i];
        } else {
			 doc.getTimeline().setSelectedLayers(i, false);
        }
    }
}