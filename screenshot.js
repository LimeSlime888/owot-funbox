/*
	by lime.owot
	version 5
	for latest version, see github:LimeSlime888/owot-funbox/screenshot.js
*/

var ss__date = true;
var ss__world = true;
var ss__coords = false;
var ss__size = false;
var ss__zoom = false;
var ss__tile = false;
var ss__user = true;

var ss_padding = 16;
var ss_fontSize = 32;
var ss_invert = false;
keyConfig.screenshot = 'CTRL+1';

function ss_copyScreenshot() {
	w.redraw();
	var [textTL, textTR, textBL, textBR] = [[],[],[],[]];

	if (ss__date) textTL.push(new Date().toISOString());
	if (ss__world) textTL.push(state.worldModel.pathname ? state.worldModel.pathname : '/');
	if (ss__coords) {
		var tileCoordX = -positionX / tileW;
		var tileCoordY = -positionY / tileH;
		var centerY = -Math.floor(tileCoordY) / coordSizeY;
		var centerX = Math.floor(tileCoordX) / coordSizeX;
		[centerY, centerX] = [centerY, centerX].map(e=>Math.floor(e*100)/100);
		textTL.push(`${centerX}, ${centerY}`);
	}
	if (ss__tile) textBL.push(`tile = ${tileW.toFixed(2)}, ${tileH.toFixed(2)}`);
	if (ss__zoom) textBL.push(zoom.toFixed(3)+'x');
	if (ss__size) textBL.push(owotWidth+'x'+owotHeight);
	if (ss__user) textTR.push(state.userModel.username || '(unregistered)');

	if (textTL.length || textTR.length || textBL.length || textBR.length) {
		var font = owotCtx.font;
		var textAlign = owotCtx.textAlign;
		var globalCompositeOperation = owotCtx.globalCompositeOperation;
		owotCtx.font = `${ss_fontSize}px monospace`;
		owotCtx.fillStyle = ss_invert ? '#fff' : styles.text;
		owotCtx.globalCompositeOperation = ss_invert ? 'difference' : 'source-over';
		owotCtx.textAlign = 'left';
		let y;
		// top left
		y = ss_fontSize*(3/4) + ss_padding;
		for (let line of textTL) {
			owotCtx.fillText(line, ss_padding, y);
			y += ss_fontSize;
		}
		// bottom left
		y = owotHeight - ss_fontSize*(1/4) - ss_padding;
		for (let line of textBL) {
			owotCtx.fillText(line, ss_padding, y);
			y -= ss_fontSize;
		}
		owotCtx.textAlign = 'right';
		// top right
		y = ss_fontSize*(3/4) + ss_padding;
		for (let line of textTR) {
			owotCtx.fillText(line, owotWidth - ss_padding, y);
			y += ss_fontSize;
		}
		// bottom right
		y = owotHeight - ss_fontSize*(1/4) - ss_padding;
		for (let line of textBR) {
			owotCtx.fillText(line, owotWidth - ss_padding, y);
			y -= ss_fontSize;
		}
		owotCtx.font = font;
		owotCtx.textAlign = textAlign;
		owotCtx.globalCompositeOperation = globalCompositeOperation;
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

function ss_makeModal() {
	var modal = new Modal();
	modal.createForm();
	modal.setFormTitle('Screenshot settings\n');
	modal.inputField.style.gridTemplateColumns = '280px 20px';
	let c_labels = {
		invert: 'Invert-color text',
		_date: '↖ Timestamp',
		_world: '↖ World name',
		_coords: '↖ Coordinates',
		_size: '↙ Image size',
		_zoom: '↙ Zoom',
		_tile: '↙ Tile size',
		_user: '↗ Username'
	};
	var [c_invert, c_date, c_world, c_coords, c_size, c_zoom, c_tile, c_user] =
	['invert', '_date', '_world', '_coords', '_size', '_zoom', '_tile', '_user'].map(function(e){
		let thing = document.createElement('input');
		thing.type = 'checkbox';
		thing.checked = window['ss_'+e] ?? false;
		thing.id = 'ss_c_'+e;
		thing.addEventListener('change', function(){
			window['ss_'+e] = this.checked;
		})
		thing.label = document.createElement('label');
		thing.label.innerText = c_labels[e];
		thing.label.id = 'ss_cl_'+e;
		modal.inputField.append(thing.label, thing);
	});
	return w.ui.screenshotModal = modal;
}
ss_makeModal();

menu.addOption('Take canvas screenshot', ()=>ss_copyScreenshot());
menu.addOption('Screenshot settings', ()=>w.ui.screenshotModal.open());