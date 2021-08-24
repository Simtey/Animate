/*ST_layersToOl v1 - Simon Thery - 2021
Nest the selected layers in a symbol over the ongoing symbol */

//an.outputPanel.clear();
var doc = an.getDocumentDOM();
var symbolName = prompt("Symbol name"); // Ask for a graphic name for the new symbol / layer

if (symbolName != null) { // Abort if cancel or no name provided
    if (doc.library.itemExists(symbolName)) { // check if the symbol name already exists
        alert('This symbol already exists, please chose another name')
    } else {
		var tl = doc.getTimeline();
		var originalItem = tl.libraryItem.name
        var selLayers = tl.getSelectedLayers();
        var originalTypes = new Array();
        var originalParents = new Array();
        LaySelectedToGuide();
        doc.exitEditMode();
        doc.getTimeline().duplicateLayers(); // duplicate the layer which contains the original symbol
        doc.getTimeline().setLayerProperty("name", symbolName) // change the layer name
        doc.library.selectNone(); //bugfix if an item is already selected in the library
        var selectName = doc.selection[0].libraryItem.name; // get the original symbol name / path
        doc.library.duplicateItem(selectName); // duplicate the original symbol in the library
        doc.library.renameItem(symbolName); // Rename this new symbol
        var libraryItemsSelected = doc.library.getSelectedItems();
        var copiedItem = libraryItemsSelected[0].name;
        SwapSymbols();
        doc.library.editItem(copiedItem); // enter in the new symbol
        OnlyOls();
        doc.getTimeline().deleteLayer(); // delete the non Ol layers
        doc.library.editItem(originalItem); // come back inside the original symbol
        doc.exitEditMode(); // to come back in the original timeline again
        OldGoodTimeline(); /// the end is just to find the original timeline again if the original symbol is nested
        var itemCheck = doc.selection[0].libraryItem.name;
        if (itemCheck !== copiedItem) {
            doc.enterEditMode();
        }
    }
}

function LaySelectedToGuide() { //turn the selected layers as guide
    var layrs = tl.layers;
    var layLength = layrs.length;
    for (i = 0; i < layLength; i++) { // and store the layers types
        layr = layrs[i];
        originalTypes[i] = layr.layerType;
        originalParents[i] = layr.parentLayer;
        if ((selLayers.indexOf(i) !== -1)) {
            tl.layers[i].layerType = "guide";
        }
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

function OnlyOls() { // turn back the selected layers layertypes
    var layrs = doc.getTimeline().layers;
    var layLength = layrs.length;
    for (i = 0; i < layLength; i++) {
        var currentLayer = layrs[i];
        currentLayer.layerType = "normal";
        if ((selLayers.indexOf(i) !== -1)) {
            currentLayer.layerType = originalTypes[i];
            currentLayer.parentLayer = originalParents[i];
        } else {
            doc.getTimeline().setSelectedLayers(i, false); // and select the layers to be deleted
        }
    }
}

function OldGoodTimeline() {
    var tl = doc.getTimeline();
    var curLayer = tl.currentLayer;
    var frameArray = tl.layers[curLayer].frames;
    var tlLength = frameArray.length;
    var currentKf;
    for (i = 0; i < tlLength; i++) { // loop to avoid a blank kf
        if (i == frameArray[i].startFrame) {
            currentKf = i;
        }
        tl.currentFrame = currentKf;
        tl.setSelectedFrames(currentKf, currentKf + 1);
        doc.selection[0];
        if (doc.selection[0] !== undefined) {
            break;
        }
    }
}