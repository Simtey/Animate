/* ST_ExportSwf_V2.0 - Simon Thery - 2019

Exports the separated layers as swf in a folder named "SWF" next to the fla

	- The files are exported with the layer's number and name
	- It works at any level of a symbol.
	- The mask and the masked layers are exported separately (when not in a folder)
	- Be carreful to well name your layers to avoid overwriting.

	1. Export only the visibles layers
		- Doesn't export the guide layers
		- If you don't want to export the guided layers hide the guide layers.
		
	2. Export the motion guided layers
		- The exported swf's name is the motion guide's one
		- If you hide the motion guide layer the guided layers won't be exported
		- All the layers guided by the same guide are exported merged
		- Bugged in Flash cs6 & older --> works fine in animate
			--> duplicate the motion guide if you need to export the guided layers separately 

	3. Export a folder layer as one merged layer
		- the exported swf's name is the folder's one
		- inside the folder the hidden layers are not exported 
		- you can hide the masks in this case the elements won't be masked
		be carefull if you hide some masked element, they must be at the end of the list otherwise the mask will appear.
		- the masks and motion guides are applied (motion guide bugged in Flash cs6 and older)
			--> if you want to export the merged layer without a mask just hide the mask.  */
			
fl.outputPanel.clear();

var doc = fl.getDocumentDOM();
var lyrs = doc.getTimeline().layers;
var length = lyrs.length;
var i;
var tl = doc.getTimeline();
var layers = tl.layers;
var originalTypes = new Array();
var originalParents = new Array();
var exitTimes;
var nLayType = new Array();
var nLayParent = new Array();
var lengthDeep;

run();

function run() {
    if (!checkSymbol()) { // Check if an instance is selected
        return;
    }

    for (i = 0; i < length; i++) { // Save orginal layerstypes at the n level
        var layer = layers[i];
        originalTypes[i] = layer.layerType;
        originalParents[i] = layer.parentLayer;
    }

    guideThemAll();
    nLayType = nLayType.slice(0, -lengthDeep); // save layertypes at n--
    nLayParent = nLayParent.slice(0, -lengthDeep); // save parents at n--
    exportThemAll();
    restoreThemAll();

    for (i = 0; i < length; i++) { // Restore original layerstypes at the n level
        var layer = layers[i];
        layer.layerType = originalTypes[i];
        layer.parentLayer = originalParents[i];
    }
}

function checkSymbol() { /// this can be automatic
    var element = doc.selection[0];

    if (!element || element.elementType !== 'instance') {
        alert('Please select any symbol !');

        return false;
    }
    return true;
}

function NextKf() { // If motion tween when enterSymbol

    var doc = fl.getDocumentDOM();
    var tl = doc.getTimeline();
    var curLayer = tl.currentLayer;
    var curFrame = tl.currentFrame;
    var frameArray = fl.getDocumentDOM().getTimeline().layers[curLayer].frames;
    var n = frameArray.length; /// this can be improved
    var nextKeyFrame /// if loop at the end and no kf we return at the beginning to find a kf
    if (n > 1) {
        for (i = curFrame + 1; i < n; i++) {
            if (i == frameArray[i].startFrame) {
                nextKeyFrame = i;
                break;
            }
        }
        tl.currentFrame += nextKeyFrame - curFrame;
        tl.setSelectedFrames(nextKeyFrame, nextKeyFrame);

    } else {
        tl.setSelectedFrames(curFrame, curFrame);
        tl.currentFrame = curFrame;
    }
}

function guideThemAll() { // Go to the main timeline and turn everything to guide
    var doc = fl.getDocumentDOM();
    var tl = doc.getTimeline();
    var exitGraphic = true;
    exitTimes = 0;
    var elemOld = fl.getDocumentDOM().selection[0].libraryItem.name;

    fl.getDocumentDOM().exitEditMode();
    bkpLaysDeep();

    var elemNew = fl.getDocumentDOM().selection[0].libraryItem.name;

    while (exitGraphic === true) {
        if (elemNew !== elemOld) { // when selected graphic = old one --> timeline's root
            tl = doc.getTimeline();
            var frames = tl.getSelectedFrames();
            var layers = new Array();
            var curLayer = tl.currentLayer;

            var tLay = tl.layers;

            for (var i = 0; i < frames.length; i += 3) { // Turn every layer to guide but the selected one
                layers.push(frames[i]);
            }

            var layersLength = tl.layers.length;

            for (var i = 0; i < layersLength; i += 1) {
                tl.setSelectedLayers(i, true);
                if (layers.indexOf(i) !== -1 && tLay[i].layerType !== 'guided') {
                    tLay[i].layerType = 'normal';
                } else if (layers.indexOf(i) !== -1 && tLay[i].layerType === 'guided') {
                    tLay[i].layerType = 'guided'; // if selected layer = guided it stays as is.
                } else {
                    tLay[i].layerType = 'guide';
                }
            }
            tl.setSelectedLayers(curLayer);
            fl.getDocumentDOM().exitEditMode();
            bkpLaysDeep();
            exitTimes = exitTimes + 1; // Count how many nested graphics
            elemOld = elemNew;
            elemNew = fl.getDocumentDOM().selection[0].libraryItem.name;
        } else {
            exitGraphic = false;
        }
    }
    for (var i = 0; i < exitTimes; i++) { // Come back to the original n level to run the export script
        var ele = doc.selection[0];
        if (fl.getDocumentDOM().selection[0] == undefined) { // if motion tween
			tl.setSelectedFrames(0,0); // we go to frame 1
			while (ele == null){ // while no element selected (to avoid blank Kf) 
            NextKf(); // we go to the next kf
			ele = doc.selection[0];
			}
            fl.getDocumentDOM().enterEditMode('inPlace');
        } else {
            fl.getDocumentDOM().enterEditMode('inPlace');
        }
    }
}

function bkpLaysDeep() { // Make an array with all the layertypes à n--
    var doc = fl.getDocumentDOM();
    var tl = doc.getTimeline();
    var i;
    var layers = tl.layers;
    lengthDeep = layers.length;
    var originalTypesDeep = new Array();
    var originalParentsDeep = new Array();

    for (i = 0; i < lengthDeep; i++) {
        layer = layers[i];
        originalTypesDeep[i] = layer.layerType;
        originalParentsDeep[i] = layer.parentLayer;

        nLayType.push(originalTypesDeep[i]);
        nLayParent.push(originalParentsDeep[i]);
    }
}

function exportThemAll() { // Export what is selected on the n timeline
    var doc = fl.getDocumentDOM();
    var lyrs = doc.getTimeline().layers;
    var length = lyrs.length;
    var i;
    var tl = doc.getTimeline();
    var modifiedTypes = new Array();
    var path = fl.getDocumentDOM().path;
    var tmp = path.split('\\');
    tmp.pop();
    var path = tmp.join('/') + '/';
    var path = 'file:///' + path.split(':').join('|').split(' ').join('%20');
    var saveDir = path;

    if (saveDir && fl.fileExists(path + 'SWF/') === false); {
        FLfile.createFolder(path + 'SWF/');
    }

    for (i = 0; i < length; i++) {
        var lyr = lyrs[i];
        if (lyr.layerType === 'mask') { // Turn masked layers to normal layers
            lyr.layerType = 'normal';
        }
    }

    for (i = 0; i < length; i++) {
        var lyr = lyrs[i];
        if (lyr.visible === false) { // Turn invisible layers to guide
            lyr.layerType = 'guide';
        }
        modifiedTypes[i] = lyr.layerType; // Save the new layertypes
    }

    for (i = 0; i < length; i++) {
        var lyr = lyrs[i];
        if (lyr.layerType === 'normal' || lyr.layerType === 'guided') {
            lyr.layerType = 'guide'; // Turn all the layers to guide
        }
    }

    for (i = 0; i < length; i++) {
        var lyr = lyrs[i];
        var modifiedType = modifiedTypes[i];
        var originalType = originalTypes[i];
        var j = i + 1;
        var LayNumber = i + 1;

        if (modifiedType === 'normal' && lyr.parentLayer === null) {
            lyr.layerType = 'normal'; // Export the normal layers
            if (LayNumber > 9) {
                doc.exportSWF(saveDir + 'SWF/' + '/' + LayNumber + '_' + lyr.name + '.swf');
            } else {
                doc.exportSWF(saveDir + 'SWF/' + '/' + '0' + LayNumber + '_' + lyr.name + '.swf');
            }

            lyr.layerType = 'guide'; // turn back to guide to export the next layers.

        } else if (modifiedType === 'folder') { // Export the layers inside the folders
            var isChild = true;
            var childLyr;
            j = i + 1;
            while (isChild === true && lyrs[j] != null) {
                childLyr = lyrs[j];

                if (childLyr !== null && childLyr.parentLayer !== null && childLyr.visible === true) {
                    childLyr.layerType = originalTypes[j]; // if children turn them to normal
                } else if (childLyr !== null && childLyr.parentLayer != null && childLyr.visible === false) {
                    isChild = true; // if invisible continue to check
                } else {
                    isChild = false; // until there is no more children
                }
                j++;
            }

            if (LayNumber > 9) {
                doc.exportSWF(saveDir + 'SWF/' + '/' + LayNumber + '_' + lyr.name + '.swf');
            } else {
                doc.exportSWF(saveDir + 'SWF/' + '/' + '0' + LayNumber + '_' + lyr.name + '.swf');
            }

            var j = i + 1;
            var isChild = true;
            while (isChild === true && lyrs[j] != null) {
                childLyr = lyrs[j];
                if (childLyr !== null && childLyr.parentLayer !== null) {
                    childLyr.layerType = 'guide'; // turn back to guide to export the next layers.
                } else {
                    isChild = false;
                }
                j++;
            }
        } else if (originalType === 'guide' && originalParents[i] === null && originalTypes[j] === 'guided' && lyr.visible === true) { // Export the motion guideds
            var isChild = true;
            var childLyr;
            while (isChild === true) {
                childLyr = lyrs[j];
                if (originalTypes[j] === 'guided') { // if children guided we put them back in guided
                    childLyr.layerType = originalTypes[j];
                } else {
                    isChild = false;
                }
                j++;
            }

            if (LayNumber > 9) {
                doc.exportSWF(saveDir + 'SWF/' + '/' + LayNumber + '_' + lyr.name + '.swf');
            } else {
                doc.exportSWF(saveDir + 'SWF/' + '/' + '0' + LayNumber + '_' + lyr.name + '.swf');
            }

            var j = i + 1;
            var isChild = true;
            while (isChild === true) {
                childLyr = lyrs[j];
                if (originalTypes[j] === 'guided') {
                    childLyr.layerType = 'guide'; // turn back to guide to export the next layers.
                } else {
                    isChild = false;
                }

                j++;
            }
        }
    }
}

function restoreThemAll() { // Restore the layertypes on the n-- timelines
    var n = 0;
    var DecExit = exitTimes;
    do {
        fl.getDocumentDOM().exitEditMode();
        DecExit = DecExit - 1;
        var lyrs = fl.getDocumentDOM().getTimeline().layers;
        var length = lyrs.length;

        for (i = 0; i < length; i++) {
            var lyr = lyrs[i];

            lyr.layerType = nLayType[n + i];
            lyr.parentLayer = nLayParent[n + i];
        }
        n = n + length; // starts the array at the good place at each n level
    } while (DecExit !== 0);
    var tl = fl.getDocumentDOM().getTimeline();
    for (var i = 0; i < exitTimes; i++) {
        var ele = doc.selection[0];
        if (fl.getDocumentDOM().selection[0] == undefined) { // if motion tween
            NextKf();
            fl.getDocumentDOM().enterEditMode('inPlace');
        } else {
            fl.getDocumentDOM().enterEditMode('inPlace');
        }
    }
}