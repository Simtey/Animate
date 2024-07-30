// ST_addLayerOrder --> Add the layer number before the layer name on the current timeline.
// Simon Thery 2024
var doc = an.getDocumentDOM();
var tl = doc.getTimeline();
for (var i = 0; i < tl.layerCount; i++) {
   tl.layers[i].name = i+1 + "_" + tl.layers[i].name;
}