/* 
ST_FramesToGraphic v1.2 - Simon Thery - 2020
goes along the file ST_FramesToGraphic.xml to be copied in the animate 'commands' directory
*/

//an.outputPanel.clear();
var doc = an.getDocumentDOM();
var tl = doc.getTimeline();
var userChoices = doc.xmlPanel(an.configURI + 'Commands/ST_FramesToGraphic.xml');
var keepOldFrames = userChoices.KeepOldFrames;
var symbolName = userChoices.symbolName;

if (userChoices.dismiss === 'accept') {

	if (doc.library.itemExists(symbolName)) {
		alert('This symbol already exists, please chose another name')
	} else {

		var selFrames = tl.getSelectedFrames(); // save selection
		var firstSelLay = parseInt(selFrames.slice(0, 1)); // first selected layer
		var firstSelFrame = parseInt(selFrames.slice(1, 2)); // first selected frame
		var lastSelLay = parseInt(selFrames.slice(-3, -2)); // last selected layer
		var lastSelFrame = parseInt(selFrames.slice(-1)); // last selected frame
		var countSelLay = 1 + lastSelLay - firstSelLay;
		var selectFrameCount = lastSelFrame - firstSelFrame;
		var newLastFrame = firstSelFrame + selectFrameCount;

		for (var i = firstSelLay; i < lastSelLay + 1; i++) {
			if (tl.layers[i].layerType !== 'folder') {
				tl.setSelectedLayers(i);
				if ((firstSelFrame !== 0)) {
					var detectKf = tl.layers[i].frames[firstSelFrame].startFrame;
					if (detectKf !== firstSelFrame) {
						tl.convertToKeyframes(firstSelFrame);
					}
				}
				if (keepOldFrames === 'false' && lastSelFrame < tl.layers[i].frameCount) {
					var detectKf = tl.layers[i].frames[lastSelFrame].startFrame;
					if (detectKf !== lastSelFrame) {
						tl.convertToKeyframes(lastSelFrame);
					}
				}
			}
		}
		tl.setSelectedLayers(firstSelLay);
		tl.addNewLayer('layerGuide_TMP', 'normal', true); //temporary layer

		var layerGuide = firstSelLay;
		tl.setSelectedLayers(layerGuide);

		if (firstSelFrame !== 0) {
			tl.convertToKeyframes(firstSelFrame);
		}
		addGuide(); // this rectangle will help to restore the current position
		tl.setSelectedLayers(lastSelLay + 1); // we trick to reselect + adding the guide layer
		tl.setSelectedFrames(firstSelFrame, lastSelFrame);
		tl.setSelectedFrames(selFrames, false);

		if (keepOldFrames === 'true') { // if we want to keep the original frames
			tl.copyFrames();
			tl.setSelectedLayers(layerGuide);
			tl.addNewLayer(symbolName, 'normal', true); // we add a new layer

			var symbolLayer = firstSelLay; // so we update the layers position number
			layerGuide = firstSelLay + 1;

			tl.setSelectedLayers(symbolLayer);

			if (firstSelFrame !== 0) {
				tl.convertToKeyframes(firstSelFrame); // blank kf to draw on it
			}

		} else { // if we want to delete the original frames
			tl.cutFrames();
			var symbolLayer = firstSelLay + 1;
			tl.setSelectedLayers(symbolLayer); // this layer will carry the graphic so
			tl.setLayerProperty('layerType', 'normal'); // in the case it is a mask
			tl.layers[symbolLayer].visible = true; // and we must be able to draw on it
			tl.layers[symbolLayer].locked = false;

			if (lastSelFrame !== 1) {
				tl.setSelectedFrames(firstSelFrame + 1, lastSelFrame - 1);
				tl.clearKeyframes(); // we must clean any blank Kf
				var detectKf = tl.layers[symbolLayer].frames[firstSelFrame].startFrame;
				if (detectKf !== firstSelFrame) { // because clearKf delete it 
					tl.convertToKeyframes(firstSelFrame); // we add a Kf back to firstselFrame
				}
				if (lastSelFrame < tl.layers[firstSelLay].frameCount) {
					var detectKf = tl.layers[symbolLayer].frames[lastSelFrame].startFrame;
					if (detectKf !== lastSelFrame) {
						tl.convertToKeyframes(lastSelFrame); // if the 1st lay is shorter
					}
				}
			}
		}
		tl.currentFrame = firstSelFrame; //fix issue if only the 1st frame is selected
		addGuide(); // we draw the same rectangle as in the guide
		tl.setSelectedFrames(firstSelFrame, firstSelFrame); // we grab the rectangle 
		doc.convertToSymbol('graphic', symbolName, 'center'); // and symbolize it 
		doc.align('horizontal center', true); // important to keep it at the accurate position
		doc.align('vertical center', true);
		doc.enterEditMode('inPlace'); // we enter inside this graphic

		var tl2 = doc.getTimeline();
		tl2.pasteFrames(); // we paste the frames
		tl2.deleteLayer(0); // we delete the layerGuide

		doc.exitEditMode(); // back to the main timeline

		tl.setSelectedLayers(symbolLayer);
		tl.setSelectedFrames(firstSelFrame, firstSelFrame);
		doc.setElementProperty('loop', 'play once'); //we set the graphic to play once

		if (keepOldFrames == 'true') { // we clean the mess
			cleanCopy();
		} else {
			cleanCut();
		}
		tl.setSelectedLayers(firstSelLay);
		if (newLastFrame > tl.layers[firstSelLay].frameCount) { // extends the layer tl if needed
			tl.setSelectedFrames(newLastFrame - 1, newLastFrame);
			tl.insertFrames();
		}
		tl.currentFrame = firstSelFrame;
		tl.setSelectedFrames(firstSelFrame, firstSelFrame);
	}
}

function addGuide() {
	doc.addNewRectangle({
		left: 0,
		top: 0,
		right: 50,
		bottom: 50
	}, 0);
}

function cleanCopy() { // delete the construction guide
	tl.deleteLayer(layerGuide);

	if (newLastFrame < tl.layers[firstSelLay].frameCount) {
		tl.setSelectedLayers(firstSelLay);
		tl.convertToBlankKeyframes(newLastFrame); //add a blank kf
	}
}

function cleanCut() { // delete the empty layers and construction guide
	tl.deleteLayer(layerGuide);
	if ((firstSelFrame === 0) && (selectFrameCount >= tl.layers[firstSelLay].frameCount)) { // when the whole tl is selected
		tl.layers[firstSelLay].name = symbolName;
		if (countSelLay > 1) {
			for (var i = firstSelLay + 1; i <= lastSelLay; i++) {
				tl.setSelectedLayers(i, false);
			}
			tl.deleteLayer();
		}
	}
}