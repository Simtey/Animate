/*ST_SelectColumn --> selects a column of key corresponding to the selection and avoid the 1st and last layer corresponding some condition (here layers names animaitique or audio for example)
This script avoid the problem of manipulating the keys due to the folders*/

//an.outputPanel.clear()
var doc = an.getDocumentDOM();
var tl = doc.getTimeline();
var selFrames = tl.getSelectedFrames();
var currentFrame = tl.currentFrame;
var firstSelFrame = parseInt(selFrames.slice(1, 2));
var lastSelFrame = parseInt(selFrames.slice(-1));
var Layer = tl.currentLayer;
var newSelection = [];
var value = true;
if (selFrames[0] === undefined) {
	firstSelFrame = currentFrame;
	lastSelFrame = currentFrame + 1;
}
for (i = cuLayer; i < tl.layerCount; i++) {
	if (i === 0 || i === 1 && value === true) { // the value permit to avoid to unselect the second layer if the 1st is selected (in this case we can't manipulate the key selection once selected)
		if (tl.layers[i].layerType !== "folder") {
			tl.setSelectedLayers(i);
			var layerName = tl.getLayerProperty("name");
			if (layerName === "ANIMATIQUE" || layerName === "INFOS") {
				value = true;
			} else { // if not one of these name we register the layer in the array.
				value = false;
				newSelection.push(i, firstSelFrame, lastSelFrame);
			}
		} /*else { // if folder we register it
			value = false;
			newSelection.push(i, firstSelFrame, lastSelFrame);
		}*/
	} else if (i === tl.layerCount - 1) { // if it is the last layer
		if (tl.layers[i].frames[firstSelFrame].soundLibraryItem === null) { // we check it is not an audio
			newSelection.push(i, firstSelFrame, lastSelFrame); // in this case we register it
		}
	} else if (tl.layers[i].layerType !== "folder"){ // we register all the other layers.
		newSelection.push(i, firstSelFrame, lastSelFrame);
	}
}
tl.setSelectedFrames(newSelection);