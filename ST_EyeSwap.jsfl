/*
Simon Thery - 2020 - EtaEyeSwap v1.1
synchronise les différentes parties des yeux des persos sur une colonne de clés.
- Ce sont les noms de calques qui sont pris en compte. Ce script nécéssite de bien ranger et nommer les calques d'yeux pour fonctionner correctement.
*/

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();
var bkpLayer = tl.currentLayer;
var bkpFrame = tl.currentFrame;
var elementFrame = doc.getElementProperty("firstFrame") ; // on sauvegarde l'exposition du symbole selectionné
var eyeOlLayArray = ["eyeskin_OL","eye_OL","maskeye_OL","eyewhite_OL"] ; /// --> éditables = Noms des calques d'yeux OL
var eyeUlLayArray = ["eyeskin_UL","eye_UL","maskeye_UL","eyewhite_UL"] ; /// --> éditables = Noms des calques d'yeux UL
var lays = tl.layers ;
var layerNameBeg = tl.getLayerProperty("name");
var SwapArray;

run();

function run() {
	if (!checkLayer()) {					// Si le layer n'est pas dans l'array on n'exécute pas le script
	return;
	}
eyeSwap();
tl.setSelectedLayers(bkpLayer);
tl.setSelectedFrames(bkpFrame,bkpFrame);
}

function checkLayer() {
	if ((eyeOlLayArray.indexOf(layerNameBeg) !== -1 )) {	 // Si le layer courant est dans l'array OL 
		SwapArray = eyeOlLayArray ;
		return true;
	} else if ((eyeUlLayArray.indexOf(layerNameBeg) !== -1)){ // ou dans l'array UL
		SwapArray = eyeUlLayArray ;	
		return true;
	} else {	
		alert("Ceci n'est pas un oeil"); // Si c'est pas présent
		return false;
	}
}

function eyeSwap() {	
for (var i = 0; i < lays.length; i++) {
	tl.setSelectedLayers(i);
	var layerName = tl.getLayerProperty("name");	// on récupère le nom du calque courant
		for each(var eyeType in SwapArray) {		// la variable swapArray dépend du layer selectionné au début
			if (layerName === eyeType ) { 			// Si le calque courant est référencé dans l'array
			tl.setSelectedFrames(bkpFrame,bkpFrame);
			doc.setElementProperty("firstFrame",elementFrame); // on lui assigne la bonne exposition
			doc.setElementProperty("loop","single frame" ); // on les met en single frame
			}
		}
	}
}