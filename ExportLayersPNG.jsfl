/********************************************************

 *   Title : Batch Exporter

 *   Author : Matt Moore <matt@mattmoore.com>

 *   Version : 1.0

 *   Description : This JSFL script is designed
 *   for batch exporting layers, library, etc

 *   as SWFs or PNGs

 *******************************************************/




var doc = fl.getDocumentDOM();

var docTimeline = doc.getTimeline();

var exportName;

var layerNum;

var layerSelection = docTimeline.getSelectedLayers();

var layers = new Array();

var count = 0

; 
var folder = fl.browseForFolderURL("Choose an output directory");

var docfoldername = doc.name;

//var exportDest = folder+ "/" +"PLAN_" + docfoldername.slice (5,11);
var exportDest = folder +"/"+ docfoldername.slice(0,(docfoldername.length-4));
FLfile.createFolder(exportDest);




// sort selection by layer index


for ( var i=0;i<layerSelection.length;i++ )

{
 
	for ( var j=0;j<layerSelection.length;j++ ) 
	{
 
		if (layerSelection[i] < layerSelection[j])
 
		{

			var temp = layerSelection[i];

			layerSelection[i] = layerSelection[j];

			layerSelection[j] = temp;
		}

	}

}




for ( var i=0;i<layerSelection.length;i++ ) 

{
 
	// hide all layers but current


	for ( var j=0;j<docTimeline.layerCount;j++ )
 
	{

 
		//only deal with normal visible layers, remember their index


		if ( docTimeline.layers[j].visible == true)

		{

			layers.push (j);

			docTimeline.layers[j].visible = false;

		}

	}

	// show layer


	var l = docTimeline.layers[layerSelection[i]];
	l.visible = true;

	var layerName = l.name;

	//determinate file name

	// export only one image if layer is the frame


	
	// Auto add number
	//FLfile.createFolder(exportDest + "/" + count + "_" + layerName)
	;
	//exportName = exportDest + "/" + count + "_" + layerName + "/" + layerName;


	//no number
	FLfile.createFolder(exportDest + "/" + layerName)
	;
	exportName = exportDest + "/" + layerName + "/" + layerName;

	doc.exportPNG(exportName + deletePNG(i+1) + ".png", true, false );
	
count += 1;

	


	l.visible = false;

}


//resets visibility


for ( var i=0;i<layers.length;i++ ) 

{

	docTimeline.layers[layers[i]].visible = true
;
}

function deletePNG()
{
	return ("_").substr( -4 );
}
