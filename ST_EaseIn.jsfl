


if(fl.getDocumentDOM().getTimeline().getFrameProperty('tweenType')==undefined)
{

var doc = fl.getDocumentDOM();
var timeLine = doc.getTimeline();
var curLayer = timeLine.currentLayer;
var curFrame = timeLine.currentFrame;


	if(fl.getDocumentDOM().getTimeline().layers[curLayer].frames[curFrame].tweenType=="motion")
	{an.getDocumentDOM().getTimeline().setFrameProperty('easeType', 5, 18, 0);
	}
	else
	{fl.getDocumentDOM().getTimeline().setFrameProperty('tweenType', 'motion');
	an.getDocumentDOM().getTimeline().setFrameProperty('easeType', 5, 18, 0);
	}


}



if(fl.getDocumentDOM().getTimeline().getFrameProperty('tweenType')=="motion")
{
an.getDocumentDOM().getTimeline().setFrameProperty('easeType', 5, 18, 0);
}

else
{
	if(fl.getDocumentDOM().getTimeline().getFrameProperty('tweenType')=="none")
	{
	fl.getDocumentDOM().getTimeline().setFrameProperty('tweenType', 'motion');
	an.getDocumentDOM().getTimeline().setFrameProperty('easeType', 5, 18, 0);
	}
}

