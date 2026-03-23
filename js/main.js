var images = {};

var app, appView;

$(function () {
  if (window.location.protocol != "file:") {
    $.get("drawCount.txt", function (data) {
      $("#drawCount").html(data);
    });
  }

  app = new App("canvas#card", "div#editor");

  $("#tipJar h3").click(function () {
    $("div#tipModal").show();
  });

  $("#tipModal #noThanks a").click(function () {
    $("div#tipModal").fadeOut();
  });
});

/*


drawContent = function() {
	canvas.width = canvas.width;
	
	context.drawImage(cardArt, 0, 0);
	
	drawTitle( $("#name").val() );
	drawKeywords( $("#keywords").val() );
	drawPrice( $("#price").val() );
	
	var verticalOffset = 392;
	
	verticalOffset = drawFluff( $("#fluff").val() , verticalOffset);
	verticalOffset += 25;
	verticalOffset = drawCardText( $("#text").val() , verticalOffset);
	
	$("#cardWrapper").addClass("valid");
	//$("#save").unbind("click").click(saveImage);
}



drawTitle = function(text) {
	
	context.textBaseline = "alphabetic";
	context.textAlign = "center";
	context.font = "bold small-caps 72px 'Rockwell Condensed'";
	context.fillStyle = 'white';
	
	context.shadowColor = "black";
	context.shadowOffsetX = 0;
	context.shadowBlur = 20;
	
	
	context.shadowOffsetX = -900;
	context.fillText(text, 450+900, 208);
	
	context.shadowOffsetX = 0;
	context.fillText(text, 450, 208);
	
};

drawKeywords = function(text) {
	
	context.textBaseline = "alphabetic";
	context.textAlign = "center";
	context.font = "normal 36px 'Rockwell Condensed'";
	context.fillStyle = 'white';
	
	context.shadowColor = "black";
	context.shadowOffsetX = 0;
	context.shadowBlur = 10;
	
	
	context.shadowOffsetX = -900;
	context.fillText(text, 450+900, 274);
	
	context.shadowOffsetX = 0;
	context.fillText(text, 450, 274);
	
};

drawPrice = function(text) {
	
	context.textBaseline = "alphabetic";
	context.textAlign = "center";
	context.font = "bold 36px 'Rockwell Condensed'";
	context.fillStyle = 'black';
	
	context.shadowColor = "transparent";
	
	context.fillText(text, 450, 344);
	
};

drawFluff = function(text, verticalOffset) {
	
	context.textBaseline = "hanging";
	context.textAlign = "center";
	context.font = "italic 36px 'Berylium'";
	context.fillStyle = 'black';
	
	context.shadowColor = "transparent";
	
	verticalOffset = wrapText(text, 450, verticalOffset, 500, 40);
	
	return verticalOffset;
	
};

drawCardText = function(text, verticalOffset) {
	
	context.textBaseline = "hanging";
	context.textAlign = "center";
	context.font = "normal 42px 'Berylium'";
	context.fillStyle = 'black';
	
	context.shadowColor = "transparent";
	
	verticalOffset = wrapText(text, 450, verticalOffset, 500, 40);
	
	return verticalOffset;
};

drawStatChange = function(text, verticalOffset) {
	
	context.drawImage(statHighlight, 450-150, verticalOffset-10);
	
	context.textBaseline = "hanging";
	context.textAlign = "center";
	context.font = "bold small-caps 46px 'Rockwell Condensed'";
	context.fillStyle = 'black';
	
	context.shadowColor = "transparent";
	
	context.fillText(text, 450, verticalOffset);
	
	return verticalOffset + 40;
};




wrapText = function(text, x, y, maxWidth, lineHeight) {
	var words = text.split(' ');
	var line = '';
	
	for(var n = 0; n < words.length; n++) {
		var testLine = line + words[n] + ' ';
		var metrics = context.measureText(testLine);
		var testWidth = metrics.width;
		if (testWidth > maxWidth && n > 0) {
			context.fillText(line, x, y);
			line = words[n] + ' ';
			y += lineHeight;
		}
		else {
			line = testLine;
		}
	}
	
	context.fillText(line, x, y);
	
	return y + lineHeight;
}



saveImage = function() {
	//canvas.toBlob(function(blob) {
	//	saveAs(blob, $("#name").val()+".png");
	//});
	var d = canvas.toDataURL("image/png");
	var w = window.open('about:blank', $("#name").val() );
	w.document.write("<img src='"+d+"' alt='" + $("#name").val() + "'/>");
}


*/
