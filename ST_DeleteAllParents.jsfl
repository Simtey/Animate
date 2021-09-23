var doc = an.getDocumentDOM();
var tl = doc.getTimeline();

var curLayer = tl.currentLayer;
var countLay = tl.layerCount;

var frameArray = tl.layers[curLayer].frames;
var tlLength = frameArray.length;

	var k = 0;
	for (i = 0; i <= tlLength; i++) { //frames
		for (j = 0; j < countLay; j++) { //layer
				tl.layers[j].setRigParentAtFrame(0, i);
				k++;	
			}
		}