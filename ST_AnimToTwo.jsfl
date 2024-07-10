/* ST_breakTo2 --> breaks the animation at a pace of 2 */
//an.outputPanel.clear();
var doc = an.getDocumentDOM();
var tl = doc.getTimeline();
var selFrames = tl.getSelectedFrames(); // save selection
var firstSelLay = parseInt(selFrames.slice(0, 1)); // first selected layer
var firstSelFrame = parseInt(selFrames.slice(1, 2)); // first selected frame
var lastSelLay = parseInt(selFrames.slice(-3, -2)); // last selected layer
var lastSelFrame = parseInt(selFrames.slice(-1)); // last selected frame
var lockedLayers = [];
for (var i = 0; i < tl.layerCount; i++) {
     lockedLayers.push(tl.layers[i].locked); // register the locked layers
     if (tl.layers[i].layerType !== "folder") {
         tl.layers[i].locked = true // lock everything
     }
}
tl.convertToKeyframes(); // puts keyframe on all the selected frames
for (var i = firstSelLay; i < lastSelLay + 1; i++) { // loop on each selected layer
     if (tl.layers[i].layerType !== 'folder') {
         if(lastSelFrame !== tl.frameCount){
         var stFrame = tl.layers[i].frames[lastSelFrame].startFrame;
         }
         tl.setSelectedLayers(i);
         tl.layers[i].locked = false; // delock the layer to work on it
         if (lastSelFrame == stFrame + 1 || lastSelFrame === tl.frameCount) { // if the last selected frame is a Key
             tl.setSelectedFrames(firstSelFrame, lastSelFrame);
         } else {
             tl.setSelectedFrames(firstSelFrame, lastSelFrame + 1);
         }
         tl.setSelectedFrames(firstSelFrame, lastSelFrame);
         tl.setFrameProperty('tweenType', 'none'); // delete the motion tweens
         for (var k = firstSelFrame + 1; k < lastSelFrame; k = k + 2) {
             tl.setSelectedFrames(k, k);
             tl.clearKeyframes(); // delete one frame on 2
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