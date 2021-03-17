/*ST_StageMatchBG_V2 - Simon Thery - 2018 for the series Go Astroboy go !

 Prepares the fla to the export and make the animation matching the production Bgs.
 The stage redimensioning part was adapted from StageMatchContent.jsfl http://keith-hair.net/

   1. Export the Swf of the original animation next to the fla file.
   2. Export the keyframes informations (scale and rotation) in a txt file next to the fla.
   3. Delete the camera, reset the main animation graphic's parameters and turn all the others layers to invisible and guide.
   4. If BG size > maximum stage size in Flash --> reduce all the animation of n x 20% until it's ok and add the reduction info inside the txt file.
   5. Adapt the stage size to the Bg's one.
   6. Define the accurate bitmaps parameters in the library if they need to be exported.                              							  */

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();

run();

function run() {
	if (!checkGraphicState()) {					// We check that the graphic is selected
		return;
	}

	SwfControl();								// We export the swf of the animation next to the fla
	getFramesInfos();							// We export a Txt file with the Kf infos (position, scale and rot)
	doc.enterEditMode('inPlace');

	var tl2 = doc.getTimeline();				// We save the layer types inside the animation graphic
	var layers = tl2.layers;
	var length = layers.length;
	var layer;
	var i;
	var originalTypes = new Array();
	var originalParent = new Array();

	for (i = 0; i < length; i++) {
		layer = layers[i];
		originalTypes[i] = layer.layerType;
		originalParent[i] = layer.parentLayer;
	}

	if (!checkBG()) {							// We make sure that there is a layer named BG (and only one)
		return;
	}
	prepAnGraph();								// We turn the BG as a a mask
	doc.exitEditMode();
	prepExp();									// On the main Tl we turn all the layers except the animation as invisible and masked 

	if (!checkGraphicSize()) {					// If the scene > max stage size in Flash we reduce it until it fits and we prints this info in the txt file
		return;
	}
	setStageMatchContentSize(element);			// We adjust the stage to the Bg
	doc.enterEditMode('inPlace');
	tl2.deleteLayer(0);							// We delete the Bg layer used as a mask inside the animation graphic

	for (i = 0; i < length; i++) {				// We restore the layer types
		layer = layers[i];
		layer.layerType = originalTypes[i];
		layer.parentLayer = originalParent[i];
	}

	doc.exitEditMode();
	BmpLoseless();								// We gives the accurate properties to all the bitmaps in the library in the case of they need to be exported
}

function checkGraphicState() {
	var element = doc.selection[0];

	if (!element || element.elementType !== 'instance' || element.libraryItem.itemType !== 'graphic') {
		alert('Please select the main animation graphic !');

		return false;
	}
	if (element.symbolType !== 'graphic') {
		fl.trace('instance ' + (element.name !== '' ? element.name : 'NONAME') + ' is not a Graphic, you may need check library in: ' + element.libraryItem.name);
	}
	return true;
}

function SwfControl() {
	var path = doc.path;											// Local file URL 
	var tmp = path.split('\\');
	var filename = tmp[tmp.length - 1];								// full file's name
	tmp.pop();														// URL def format
	path = tmp.join('/') + '/';
	path = 'file:///' + path.split(':').join('|').split(' ').join('%20');

	var FilenameTitle = filename.slice('.fla');						// Export files format swf / txt
	var FilenameSwf = filename.split('.fla').join('.swf');
	var FilenameTxt = filename.split('.fla').join('.txt');

	exportLocal();

	function exportLocal() {
		var fileFormat = filename.split('_');						// File's format check (LABxxx_AN_xxx_tkxx.fla)
		if (fileFormat.length === 4) {
			
			var exportCamLocal = path + FilenameSwf;
			var exportTxtLocal = path + FilenameTxt;

			doc.exportSWF(exportCamLocal, 'true');					//swf exportation
			FLfile.write(exportTxtLocal, FilenameTitle + '\n \n');	// We export the txt too, it make the previous one blank if have to run the script again
		}
	}
}

function getFramesInfos() {
	var curLayer = tl.currentLayer;
	var curFrame = tl.currentFrame;
	var frameArray = tl.layers[curLayer].frames;
	var n = frameArray.length;
	
	for (i = 0; i < n; i++) {										// loop to get the keyframes info
		if (i === frameArray[i].startFrame) {
			tl.currentFrame += i - curFrame;
			tl.setSelectedFrames(i, i);
			printKfInfo();
			tl.setSelectedFrames(0, 0);
		}
	}

	function printKfInfo() {										// we seek to the txt file previously created
		var path = doc.path;
		var tmp = path.split('\\');
		var filename = tmp[tmp.length - 1];
		tmp.pop();
		path = tmp.join('/') + '/';
		path = 'file:///' + path.split(':').join('|').split(' ').join('%20');

		var FilenameTxt = filename.split('.fla').join('.txt');

		exportLocal();

		function exportLocal() {
			var fileFormat = filename.split('_');
			if (fileFormat.length === 4) {							// File's format check (LABxxx_AN_xxx_tkxx.fla)					
				element = doc.selection[0];
				var curFrame = tl.currentFrame;
				curFrame = curFrame + 1;
				var exportTxtLocal = path + FilenameTxt;
				var infoScaleX = element.scaleX;					// variables to be printed heare scale x/y and rot
				var infoScaleY = element.scaleY;
				var infoRot = element.rotation;

				FLfile.write(exportTxtLocal, 'f' + curFrame + ' : Scale x/y = ' + infoScaleX.toFixed(4) * 100 + ' %' + '/' + infoScaleY.toFixed(4) * 100 + ' % ' + '|' + ' Rot. = ' + infoRot.toFixed(2) + ' deg\n', 'append');
			}
		}
	}
}

function checkBG() {
	var tl2 = doc.getTimeline();
	var layerBG = tl2.findLayerIndex('BG');											// Inside the main anim graphic we seek for the layer "BG"

	if (layerBG === undefined || layerBG === null || layerBG.length !== 1) {		// If it does'nt exist | more of 1 layer "BG" we abort
		doc.exitEditMode();
		alert('Layer named BG missing or too many of them inside the animation graphic !');
		return false;
	}

	return true;
}

function prepAnGraph() {
	var tl2 = doc.getTimeline();
	var layerBG = tl2.findLayerIndex('BG');
	var layers = tl2.layers;

	for (var i = 0; i < layers.length; i++) {
		if (layers[i].layerType !== 'normal') {										// Inside the main anim graphic we turn all the layers as normal
			tl2.setSelectedLayers(i, i);
			tl2.setLayerProperty('layerType', 'normal');
		}
	}
	tl2.setSelectedLayers(layerBG[0], true);										//We copy the layer BG over all the other ones
	tl2.copyLayers();
	tl2.pasteLayers(0);
	tl2.setLayerProperty('layerType', 'mask');										// It is turned as a mask

	var layers3 = tl2.layers;														// As we have 1 more layer we have to refresh the variable
	
	for (var i = 0; i < layers3.length; i++) {										// We turn all the others layers as masked
		if (layers3[i].layerType !== 'mask') {
			tl2.setSelectedLayers(i, i);
			tl2.setLayerProperty('layerType', 'masked');
		}
	}
}

function checkGraphicSize() {														//We check the graphic's size (= Bg's one now)
	element = doc.selection[0];
	var RedCount = 0;
	var path = doc.path;
	var tmp = path.split('\\');
	var filename = tmp[tmp.length - 1];
	tmp.pop();
	path = tmp.join('/') + '/';
	path = 'file:///' + path.split(':').join('|').split(' ').join('%20');
	var FilenameTxt = filename.split('.fla').join('.txt');
	var fileFormat = filename.split('_');
	var exportTxtLocal = path + FilenameTxt;

	if (element.width >= 8192 || element.height >= 8192) {							// if > maximum Flash stage size
		do {
			doc.scaleSelection(0.8, 0.8);											// We reduce it here from 20%
			RedCount++;
		} while (element.width >= 8192 || element.height >= 8192);					// and we loop until x and y <= 8192 px

		if (fileFormat.length === 4) {												// When size ok and if doc = LABxxx_AN_xxx_tkxx.fla we print the number of loops on the existing txt file

			FLfile.write(exportTxtLocal, '\nAnimation layers reduction = ' + RedCount + ' x ' + '- 20 % \n' + '--> Animation to be increased by ' + RedCount + ' x ' + '125 % in After Effects.', 'append');
		}
	}
	return true;
}

function prepExp() {
	var frames = tl.getSelectedFrames();
	var layers = new Array();
	var curLayer = tl.currentLayer;
	var tLay = tl.layers;

	for (var i = 0; i < frames.length; i += 3) {
		layers.push(frames[i]);
	}

	var layersLength = tl.layers.length;

	for (var i = 0; i < layersLength; i += 1) {
		tl.setSelectedLayers(i, true);
		if (layers.indexOf(i) !== -1) {
			tl.setLayerProperty('visible', true);					// We make sure that the main animation layer is visible
		} else {
			tl.setLayerProperty('visible', false);					// and we set the other ones to invisible
		}
	}

	tl.setSelectedFrames(frames);

	for (i in tLay) {
		if (tLay[i].visible === false) tLay[i].layerType = 'guide';		// then we turn the invisible layers to guide

		var tweenObj = tl.layers[curLayer].frames[0].tweenObj;			// we go on the frame 1
		var frmCount = tl.frameCount;

		tl.layers[curLayer].frames[0].tweenType = 'none';				// we delete the motion tween if any
		tl.layers[curLayer].frames[0];
		tl.clearKeyframes(1, frmCount);									//then we delete all the other keyframes
		tl.setSelectedFrames(frames);
		fl.getDocumentDOM().resetTransformation();						// and we delete all the transformations on the main animation graphic (scale = 100%, no rot and skew)
	}
}

function setStageMatchContentSize(mc) {									// then we make the stage fitting to this graphic (= Bg's size)
	var item = mc.libraryItem;
	var t = item.timeline;
	var layercount = t.layers.length;
	var layer = null;

	var names = mc.name;
	mc.symbolType = 'graphic';

	var boundsAry = [];
	var bounds; {
		if (!(mc.width == 0 || mc.height == 0)) {
			bounds = {};
			bounds.x = mc.left - mc.x;
			bounds.y = mc.top - mc.y;
			bounds.width = mc.width;
			bounds.height = mc.height;
			bounds.left = bounds.x;
			bounds.right = bounds.width + bounds.left;
			bounds.top = bounds.y;
			bounds.bottom = bounds.height + bounds.top;
			boundsAry.push(bounds);
		}
	}
	var boundsLen = boundsAry.length;
	var resultRect = null;
	if (boundsLen > 0) {
		resultRect = boundsAry[0];
		for (var k = 1; k < boundsLen; k++) {
			resultRect = union(resultRect, boundsAry[k], resultRect);
		}
	}
	if (resultRect) {
		round(resultRect);

		log(resultRect);
		var rp = {
			x: -resultRect.x,
			y: -resultRect.y
		};
		mc.x = rp.x;
		mc.y = rp.y;
		doc.width = resultRect.width;
		doc.height = resultRect.height;
	}
	mc.symbolType = 'graphic';
	mc.name = names;
}

function log(data) {
	var str = logComplexObj(data);
}

function logComplexObj(data) {
	var k = [];
	for (var i in data) {
		if (typeof (data[i]) === 'object') {
			k.push(String('{' + i + ':' + logComplexObj(data[i]) + '}'));
		} else {
			k.push(String('{' + i + ':' + data[i] + '}'));
		}
	}
	return k.join('<->');
}

function union(lr, rr, result) {
	var x = Math.min(lr.x, rr.x);
	var y = Math.min(lr.y, rr.y);
	var width = Math.max(lr.right, rr.right) - Math.min(lr.left, rr.left);
	var height = Math.max(lr.bottom, rr.bottom) - Math.min(lr.top, rr.top);

	result.x = x;
	result.y = y;
	result.width = width;
	result.height = height;

	result.left = result.x;
	result.right = result.width + result.left;
	result.top = result.y;
	result.bottom = result.height + result.top;
	return result;
}

function round(rect) {
	var x = Math.floor(rect.left);
	var y = Math.floor(rect.top);
	var w = Math.ceil(rect.right) - x;
	var h = Math.ceil(rect.bottom) - y;

	rect.x = x;
	rect.y = y;
	rect.width = w;
	rect.height = h;
	rect.left = rect.x;
	rect.right = rect.width + rect.left;
	rect.top = rect.y;
	rect.bottom = rect.height + rect.top;
}

function BmpLoseless() {										// This last function finds the 'bitmaps' inside the library and change their properties
	for (idx in doc.library.items) {
		if (doc.library.items[idx].itemType === 'bitmap') {
			var myItem = doc.library.items[idx];
			myItem.compressionType = 'lossless';				// lossless and allow smoothing keep the best quality possible for these bitmaps.
			myItem.allowSmoothing = true;
		}
	}
}