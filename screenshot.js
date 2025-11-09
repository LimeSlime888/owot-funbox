/*
	by lime.owot
	version 5
	for latest version, see github:LimeSlime888/owot-funbox/screenshot.js
*/

var ss_overlays = {
	date: true,
	world: true,
	coords: false,
	size: false,
	zoom: false,
	tile: false,
	user: true,
};

var ss_padding = 16;
var ss_fontSize = 32;
var ss_invert = false;
keyConfig.screenshot = 'CTRL+1';

function ss_copyScreenshot() {
	w.redraw();
	var [textTL, textTR, textBL, textBR] = [[],[],[],[]];

	if (ss_overlays.date) textTL.push(new Date().toISOString());
	if (ss_overlays.world) textTL.push(state.worldModel.pathname ? state.worldModel.pathname : '/');
	if (ss_overlays.coords) {
		var tileCoordX = -positionX / tileW;
		var tileCoordY = -positionY / tileH;
		var centerY = -Math.floor(tileCoordY) / coordSizeY;
		var centerX = Math.floor(tileCoordX) / coordSizeX;
		[centerY, centerX] = [centerY, centerX].map(e=>Math.floor(e*100)/100);
		textTL.push(`${centerX}, ${centerY}`);
	}
	if (ss_overlays.tile) textBL.push(`tile = ${tileW.toFixed(2)}, ${tileH.toFixed(2)}`);
	if (ss_overlays.zoom) textBL.push(zoom.toFixed(3)+'x');
	if (ss_overlays.size) textBL.push(owotWidth+'x'+owotHeight);
	if (ss_overlays.user) textTR.push(state.userModel.username || '(unregistered)');

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
		alert('Copied image.');
	});
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
	modal.setFormTitle('Screenshot settings');
	modal.inputField.style.gridTemplateColumns = '280px 20px';
	modal.inputField.style.marginBottom = '';
	modal.inputField.style.margin = '10px 0';
	let c_labels = {
		invert: 'Invert-color text',
		date: '↖ Timestamp',
		world: '↖ World name',
		coords: '↖ Coordinates',
		size: '↙ Image size',
		zoom: '↙ Zoom',
		tile: '↙ Tile size',
		user: '↗ Username'
	};
	var [c_date, c_world, c_coords, c_size, c_zoom, c_tile, c_user, c_invert] =
	['date', 'world', 'coords', 'size', 'zoom', 'tile', 'user', '.invert'].map(function(e){
		let thing = document.createElement('input');
		thing.type = 'checkbox';
		thing.label = document.createElement('label');
		if (e.startsWith('.')) {
			e = e.substr(1);
			thing.id = 'ss_c__'+e;
			thing.label.innerText = c_labels[e];
			thing.label.id = 'ss_cl__'+e;
		} else {
			thing.checked = ss_overlays[e] ?? false;
			thing.id = 'ss_c_'+e;
			thing.addEventListener('change', function(){
				ss_overlays[e] = this.checked;
			})
			thing.label.innerText = c_labels[e];
			thing.label.id = 'ss_cl_'+e;
		}
		modal.inputField.append(thing.label, thing);
		return thing;
	});

	c_invert.checked = ss_invert;
	c_invert.addEventListener('change', function(){
		ss_invert = this.checked;
	});

	return w.ui.screenshotModal = modal;
}
ss_makeModal();

menu.addOption('Take canvas screenshot', ()=>ss_copyScreenshot());
menu.addOption('Screenshot settings', ()=>w.ui.screenshotModal.open());