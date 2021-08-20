an.outputPanel.clear();
/*
- Si plusieurs frames dans la tl principale (ex cassé à 2 ) faire le swap sur chaque frame
- peut être améliorer le prompt

*/



var doc = an.getDocumentDOM();
var tl = doc.getTimeline();
var symbolName = prompt("Symbol name"); // demande un nom de graphique à l'utilisateur

		if (doc.library.itemExists(symbolName)) { // le nom ne doit pas exister dans la bibli
			alert('This symbol already exists, please chose another name')
		} else {
var selLayers = tl.getSelectedLayers();
var selFrames = tl.getSelectedFrames(); // on sauvegarde les calques selectionnés (array)
	LaySelectedToGuide(); // on prend les calques selectionnés et on les met en guide (fonction)
	doc.exitEditMode(); // on va dans la timeline principale
	
var tl2 = doc.getTimeline();
var curLayer = tl2.currentLayer;
	
	tl2.duplicateLayers(); // on duplique le calque 
	tl2.setLayerProperty("name", symbolName) // et on change son nom
	
var itemSelected = doc.selection[0].libraryItem ; // selection du graphique
var selectName = itemSelected.name ; // path du graphique dans la bibliotheque

	doc.library.duplicateItem(selectName); // on duplique le symbole dans la biblio
	doc.library.renameItem(symbolName); // on rename ce symbole avec le nom choisi par le user

/// NextKf(); // si clé sur la tl principale
	tl2.setSelectedFrames(0,0);
	doc.selection[0]; //inclure dans NextKf
	doc.swapElement(symbolName); //inclure dans NextKf // on interverti le symbole sur la bonne tl
	
	doc.enterEditMode(); // on entre dans ce nouveau symbole
 deleteNonOl();
//	LaySelectedToNormal(); // on remet les calques en Normal (fonction)

/// doc.exitEditMode();
	
}
			
			
			
function LaySelectedToGuide() {
	for (n=0; n<selFrames.length; n+=3) {
		layerNum=selFrames[n];
		tl.layers[layerNum].layerType = "guide";
	}		
}

function NextKf() { /// ne marche pas encore

    var doc = fl.getDocumentDOM();
    var tlx = doc.getTimeline();
    var curLayer = tlx.currentLayer;
    var curFrame = tlx.currentFrame;
    var frameArray = fl.getDocumentDOM().getTimeline().layers[curLayer].frames;
    var n = frameArray.length;
	an.trace(curFrame);
    var nextKeyFrame ;
    if (n > 1) {
        for (var i = curFrame; i <= n; i++) {
            if (i == frameArray[i].startFrame) {
                nextKeyFrame = i;
			an.trace(nextKeyFrame);	
                break;
            }
        }
        tlx.currentFrame = nextKeyFrame - curFrame;
        tlx.setSelectedFrames(nextKeyFrame, nextKeyFrame);
		doc.selection[0];
		doc.swapElement(symbolName);

    } else {
        tlx.setSelectedFrames(curFrame, curFrame);
        tlx.currentFrame = curFrame;
		doc.selection[0];
		doc.swapElement(symbolName);
    }
}

function LaySelectedToNormal() {
	
	var tl3 = doc.getTimeline();
	var NumLayer = tl3.layerCount;
	var layers = tl3.layers;

	for (var i=0; i < NumLayer; i++) {
		var currentLayer = layers [i];
	currentLayer.layerType = 'normal';
	}
}

function deleteNonOl() {
	var tl3 = doc.getTimeline();
	for each(var layToKeep in selLayers){
	//tl3.setSelectedLayers(layToKeep,false);
tl3.deleteLayer(); /// trouver le moyen d'inverser la selection
	}
	//setSelectedFrames(0,0);
}

