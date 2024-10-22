/* ST_NumLayers --> Add the layer number before the layer name on the current timeline. Works with ST_NumLayers.jsfl
Simon Thery 2024 */

var doc = an.getDocumentDOM();
var tl = doc.getTimeline();
var userChoices = doc.xmlPanel(an.configURI + 'Commands/ST_numLayers.xml');
var renameChoice = userChoices.choiceRename;
var selFrames = tl.getSelectedFrames(); // save selection
var firstSelLay = parseInt(selFrames.slice(0, 1)); // first selected layer
var lastSelLay = parseInt(selFrames.slice(-3, -2)); // last selected layer

if (userChoices.dismiss === "accept") {
	if (renameChoice === "Number selected layers") {
		renameSelection();
	} else {
		renameAll();
	}
}

function renameAll() {
	for (var i = 0; i < tl.layerCount; i++) {
		if (i < 9) {
			tl.layers[i].name = "_" + 0 + (i + 1) + "_" + tl.layers[i].name;
		} else {
			tl.layers[i].name = "_" + (i + 1) + "_" + tl.layers[i].name;
		}
	}
}

function renameSelection() {
	var k = 1;
	for (var i = firstSelLay; i <= lastSelLay; i++) {
		if (k < 10) {
			tl.layers[i].name = "_" + "0" + k + "_" + tl.layers[i].name;
		} else {
			tl.layers[i].name = "_" + k + "_" + tl.layers[i].name;
		}
		k++
	}
}