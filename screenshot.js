/*
	by lime.owot
	version 4
	for latest version, see github:LimeSlime888/owot-funbox/screenshot.js
*/

var ss_coords = false;
var ss_world = true;
var ss_tile = false;
var ss_date = true;

var ss_padding = 16;
var ss_fontSize = 32;
keyConfig.screenshot = 'CTRL+1';

function ss_copyScreenshot() {
	w.redraw();
	var text = false;
	if (ss_coords || ss_world || ss_tile || ss_date) {
		var font = owotCtx.font;
		var textAlign = owotCtx.textAlign;
		owotCtx.font = `${ss_fontSize}px monospace`;
		owotCtx.textAlign = 'left';
		owotCtx.fillStyle = styles.text;
		text = true;
	}
	if (ss_coords || ss_world || ss_date) {
		let toText = [];
		if (ss_date) toText.push(new Date().toISOString());
		if (ss_world) toText.push(state.worldModel.pathname ? state.worldModel.pathname : '/');
		if (ss_coords) {
			var tileCoordX = -positionX / tileW;
			var tileCoordY = -positionY / tileH;
			var centerY = -Math.floor(tileCoordY) / coordSizeY;
			var centerX = Math.floor(tileCoordX) / coordSizeX;
			[centerY, centerX] = [centerY, centerX].map(e=>Math.floor(e*100)/100);
			toText.push(`${centerX}, ${centerY}`);
		}
		let y = ss_fontSize*(3/4) + ss_padding;
		for (let line of toText) {
			owotCtx.fillText(line, ss_padding, y);
			y += ss_fontSize*(13/12);
		}
	}
	if (ss_tile) {
		owotCtx.fillText(`tile = ${tileW.toFixed(2)}, ${tileH.toFixed(2)}`,
			ss_padding, owotHeight - ss_fontSize*(1/8) - ss_padding);
	}
	if (text) {
		owotCtx.font = font;
		owotCtx.textAlign = textAlign;
	}
	owot.toBlob(function(blob){
		navigator.clipboard.write([new ClipboardItem({
			'image/png': blob
		})]);
	});
	alert('Copied image.');
}

document.removeEventListener('keydown', window.ss_onKeyDown);
function ss_onKeyDown(e) {
	if (!checkKeyPress(e, keyConfig.screenshot)) { return false }
	ss_copyScreenshot();
}
document.addEventListener('keydown', ss_onKeyDown);

menu.addOption('Take canvas screenshot', ()=>ss_copyScreenshot());
menu.addCheckboxOption('Screenshot: coordinates', ()=>ss_coords=true, ()=>ss_coords=false, ss_coords);
menu.addCheckboxOption('Screenshot: world name', ()=>ss_world=true, ()=>ss_world=false, ss_world);
menu.addCheckboxOption('Screenshot: tile size', ()=>ss_tile=true, ()=>ss_tile=false, ss_tile);
menu.addCheckboxOption('Screenshot: date', ()=>ss_date=true, ()=>ss_date=false, ss_date);