var DrawingStroke = fl.getDocumentDOM().getCustomStroke(); 

DrawingStroke.color = "#FF0000";
DrawingStroke.style = "solid"; 
DrawingStroke.thickness = 3;  //0.5
DrawingStroke.scaleType = "none";

fl.selectTool("paintBrush");
fl.getDocumentDOM().setCustomStroke( DrawingStroke );