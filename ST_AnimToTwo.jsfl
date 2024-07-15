/* ST_breakTo2 --> breaks the animation at a pace of 2 */
//TO DO --> essayer de rendre รงa moins lourd
//an.outputPanel.clear();
var doc = an.getDocumentDOM();
var tl = doc.getTimeline();
var selFrames = tl.getSelectedFrames(); // save selection
var firstSelLay = parseInt(selFrames.slice(0, 1)); // first selected layer
var firstSelFrame = parseInt(selFrames.slice(1, 2)); // first selected frame
var lastSelLay = parseInt(selFrames.slice(-3, -2)); // last selected layer
var lastSelFrame = parseInt(selFrames.slice(-1)); // last selected frame
var lockedLayers = [];
var frameCount = tl.frameCount;
if (lastSelFrame !== 1){
for (var i = 0; i < tl.layerCount; i++) {
     lockedLayers.push(tl.layers[i].locked); // register the locked layers
     if (tl.layers[i].layerType !== "folder") {
         tl.layers[i].locked = true // lock everything
     }
}
tl.convertToKeyframes(); // puts keyframe on all the selected frames
for (var i = firstSelLay; i < lastSelLay + 1; i++) { // loop on each selected layer
     if (tl.layers[i].layerType !== 'folder') {
         if(lastSelFrame !== frameCount){
         var lastKeyFrame = tl.layers[i].frames[lastSelFrame].startFrame;
         }
         tl.setSelectedLayers(i);
         tl.layers[i].locked = false; // delock the layer to work on it
         if (lastSelFrame === lastKeyFrame + 1 || lastSelFrame === frameCount) { // if the last selected frame is a Key or the last key is selected
             tl.setSelectedFrames(firstSelFrame, lastSelFrame); // not to delete the motion tween on it
         } else {
             tl.setSelectedFrames(firstSelFrame, lastSelFrame + 1);
         }
         tl.setFrameProperty('tweenType', 'none'); // delete the motion tweens
         for (var k = firstSelFrame + 1; k < lastSelFrame; k = k + 2) {
             tl.setSelectedFrames(k, k);
             tl.clearKeyframes(); // delete one frame on 2
			 if(tl.layers[i].frames[lastSelFrame -1].startFrame !== lastSelFrame -1 && lastSelFrame !== frameCount){ // if an odd number of frame selected don't change the loop style of the last kf
				tl.setSelectedFrames(firstSelFrame, lastSelFrame -2);
			 }
             doc.selectAll();
             doc.setElementProperty('loop', 'single frame'); // set the element on single frame
         }
         tl.layers[i].locked = true; // relock the layer
     }
}
for (var i = 0; i < tl.layerCount; i++) { // put back the locked layers
     for (var i in lockedLayers) {
         tl.layers[i].locked = lockedLayers[i];
     }
}
tl.setSelectedFrames(firstSelFrame, firstSelFrame);
}
