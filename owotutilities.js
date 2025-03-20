w.broadcastReceive(1);
convertTileToXY = (tileX,tileY,charX,charY)=>[tileX*tileC+charX, tileY*tileR+charY]
convertXYtoTile = (x,y)=>{
	return [Math.floor(x / tileC),
	Math.floor(y / tileR),
	x - Math.floor(x / tileC) * tileC,
	y - Math.floor(y / tileR) * tileR]
}
q_queue = [];
q_queueMax = 4096;
queueCharToXY = function (char, charColor, x, y, noUndo=true, priority=0, decoration=null, bgColor) {
	if (q_queue.length > q_queueMax) {return}
	x = Math.floor(x);y = Math.floor(y);
	if (!Permissions.can_color_text(state.userModel, state.worldModel)) charColor=0;
	q_queue.push([char, charColor, x, y, noUndo, priority, decoration, bgColor]);
}
writeFailsafe = 1;
writeBufferMax = 8192;
writeCharToXY = function (char, charColor, x, y, noUndo=true, bgColor=null,
						 dB=false, dI=false, dU=false, dS=false) {
	if (writeBuffer.length > writeBufferMax) {return}
	if (char == '\r' || char == '\n') {return}
	if (getCharInfoXY(x, y).protection >= writeFailsafe) {return}
	x = Math.floor(x);y = Math.floor(y);
	if (!Permissions.can_color_text(state.userModel, state.worldModel)) charColor=0;
	writeCharTo(char, charColor, ...convertXYtoTile(x, y), noUndo, null,
			   bgColor, dB, dI, dU, dS);
}
writeTextToXY = function (text, color, x, y, noUndo=true) {
	text = text+"";
	textArray = [...text];
	xpos=0;line=0;flag=0;
	if(color=="line"){flag=text.split('\n').length;color=0xffffff-((8-flag)*0x201000);}
	textArray.forEach(
		function(writing, index){
			if (writing == '\n') {line+=1;xpos=0;
				if(flag>0){color=0xffffff-((8-flag)*0x201000);flag--;}
				if(color>0xffffff){color=0xffffff}
				return
			}
			if (writing == '\0') {xpos+=1;return}
			writeCharToXY(writing,color,x+xpos,y+line,noUndo);
			xpos += 1;
		}
	)
}
queueTextToXY = function (text, color, x, y, noUndo=true, priority=0, decoration=null, bgColor) {
	text = text+"";
	textArray = [...text];
	xpos=0;line=0;flag=0;
	if(color=="line"){flag=text.split('\n').length;color=0xffffff-((8-flag)*0x201000);}
	textArray.forEach(
		function(writing, index){
			if (writing == '\n') {line+=1;xpos=0;
				if(flag>0){color=0xffffff-((8-flag)*0x201000);flag--;}
				if(color>0xffffff){color=0xffffff}
				return
			}
			if (writing == '\0') {xpos+=1;return}
			queueCharToXY(writing,color,x+xpos,y+line,noUndo,priority,decoration,bgColor);
			xpos += 1;
		}
	)
}
q_flushedCount = 0;
flushQueue = function (firstCheck = true, secondCheck = true, secondCheckLinks = false) {
	let i = 0;
	if (firstCheck) {
		while (i<q_queue.length) {
			let j = q_queue[i];
			if (q_queue.filter(e=>e!=j&&e[2]==j[2]&&e[3]==j[3]&&e[5]>=j[5]).length) {
				q_queue.splice(i, 1);
			} else {i++}
		}
	}
	if (secondCheck) {
		i = 0;
		while (i<q_queue.length) {
			let j = [...q_queue[i]];
			let jinfo = getCharInfoXY(j[2], j[3]);
			let compress = e=>!!e.bold*8+!!e.italic*4+!!e.under*2+!!e.strike
			if (j[6] && jinfo.decoration) {
				j[6] = compress(j[6])
				jinfo.decoration = compress(jinfo.decoration)
			}
			if (jinfo.char == j[0] && jinfo.color == j[1] && jinfo.decoration == j[6]
			   && jinfo.bgColor == (j[7] ?? -1) && (!secondCheckLinks||!getLinkXY(j[2], j[3]))) {
				q_queue.splice(i, 1);
			} else {i++}
		}
	}
	q_queue.forEach(e=>{
		e[5] = e[7];
		e[6] ??= {};
		e[7] = e[6].italic;
		e[8] = e[6].under;
		e[9] = e[6].strike;
		e[6] = e[6].bold;
		writeCharToXY(...e);
		q_flushedCount++;
	});
	q_queue.splice(0);
}
w.setFlushInterval(1);
abortCounts = {};
pasteChars = function(value){
	var parser = textcode_parser(value, {
			tileX: cursorCoords[0],
			tileY: cursorCoords[1],
			charX: cursorCoords[2],
			charY: cursorCoords[3]
		}, YourWorld.Color, YourWorld.BgColor);
	var yieldItem;
	pasteInterval = setInterval(function() {
		var res;
		if(yieldItem) {
			res = cyclePaste(null, yieldItem);
			yieldItem = null;
		} else {
			res = cyclePaste(parser);
		}
		if(!res || cursorCoords == null) {
			clearInterval(pasteInterval);
			write_busy = false;
		} else if(typeof res == "object") {
			yieldItem = res;
		}
	}, 16);
}
linkURLXY = function(url, x, y){
	if (String.isPrototypeOf(url)) return false;
	if (x==_||y==_) {
		let cc = convertTileToXY(...cursorCoords.swap(1,2));
		x ??= cc[0]; y ??= cc[1];
	}
	let link = getLinkXY(x, y);
	if (link && link.type == 'url' && link.url == url) return 0;
	let tileCoords = convertXYtoTile(x, y);
	network.link({
		tileX: tileCoords[0],
		tileY: tileCoords[1],
		charX: tileCoords[2],
		charY: tileCoords[3]
	}, 'url', {url: url});
	return true;
}
linkCoordXY = function(toX=0, toY=0, x, y){
	if (x==_||y==_) {
		let cc = convertTileToXY(...cursorCoords.swap(1,2));
		x ??= cc[0]; y ??= cc[1];
	}
	let link = getLinkXY(x, y);
	if (link && link.type == 'coord' && link.link_tileX == toX && link.link_tileY == toY) return 0;
	let tileCoords = convertXYtoTile(x, y);
	network.link({
		tileX: tileCoords[0],
		tileY: tileCoords[1],
		charX: tileCoords[2],
		charY: tileCoords[3]
	}, 'coord', {x: toX, y: toY});
	return true;
}
cyclePaste = Function("parser", "yieldItem", cyclePaste.toString().match(new RegExp('(?<=\{)[^]{0,}(?=\})'))[0].replace('\t\treturn true;', '\t\tmoveCursor("right");return true;'));
getCombDecoration = c=>{let d = ([...c][1]??" ").codePointAt()-0x20f0;return {bold:d&8,italic:d&4,under:d&2,strike:d&1}}
cyclePasteQueue = Function("parser", "yieldItem", cyclePaste.toString().match(new RegExp('(?<=\{)[^]{0,}(?=\})'))[0].replace(
	'writeChar(item.char, false, item.color, !item.newline, 0, item.bgColor);',
	`queueCharToXY(item.char, item.color, ...convertTileToXY(...cursorCoords.swap(1,2)), _, _, getCombDecoration(item.char), item.bgColor);if(item.char=="\\n"||item.char=="\\r"){writeChar("\\n")}else{moveCursor("right", true)}`))
instaPaste = function(value){
	var parser = textcode_parser(value, {
			tileX: cursorCoords[0],
			tileY: cursorCoords[1],
			charX: cursorCoords[2],
			charY: cursorCoords[3]
		}, YourWorld.Color, YourWorld.BgColor);
	var yieldItem;
	let [prevMaxQ, prevMax] = [q_queueMax, writeBufferMax];
	q_queueMax = writeBufferMax = Infinity;
	while(true){
		var res;
		if(yieldItem) {
			res = cyclePasteQueue(null, yieldItem);
			yieldItem = null;
		} else {
			res = cyclePasteQueue(parser);
		}
		if(!res || cursorCoords == null) {
			break;
		} else if(typeof res == "object") {
			yieldItem = res;
		}
	}
	write_busy = false;
	flushQueue();
	[q_queueMax, writeBufferMax] = [prevMaxQ, prevMax];
}