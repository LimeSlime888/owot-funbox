/*
   by lime.owot
   version 0
   for latest version, see github:LimeSlime888/owot-funbox/screenshot.js
*/

var ss_coords = false;
var ss_world = false;
var ss_padding = 16;
var ss_fontSize = 32;

menu.addOption('Take canvas screenshot', function(){
	if (ss_coords || ss_world) {
		var tileCoordX = -positionX / tileW;
		var tileCoordY = -positionY / tileH;
		var centerY = -Math.floor(tileCoordY / coordSizeY);
		var centerX = Math.floor(tileCoordX / coordSizeX);
		let font = owotCtx.font;
		let textAlign = owotCtx.textAlign;
		owotCtx.font = `${ss_fontSize}px monospace`;
		owotCtx.textAlign = 'left';
		owotCtx.fillStyle = styles.text;
		let toText = [];
		if (ss_world) toText.push(state.worldModel.pathname ? state.worldModel.pathname : '/');
		if (ss_coords) toText.push(`${centerX}, ${centerY}`);
		let y = ss_fontSize*(3/4) + ss_padding;
		for (let line of toText) {
			owotCtx.fillText(line, ss_padding, y);
			y += ss_fontSize;
		}
		owotCtx.font = font;
		owotCtx.textAlign = textAlign;
	}
	owot.toBlob(function(blob){
		navigator.clipboard.write([new ClipboardItem({
			'image/png': blob
		})]);
	});
	alert('Copied image.');
});
menu.addCheckboxOption('Screenshot: coordinates', ()=>ss_coords=true, ()=>ss_coords=false, false);
menu.addCheckboxOption('Screenshot: world name', ()=>ss_world=true, ()=>ss_world=false, false);