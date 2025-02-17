window.sleep ??= function(ms) {
	return new Promise(function(resolve) {
		setTimeout(resolve, ms);
	});
}

w.sfx = {
	warp: new Audio("https://files.catbox.moe/9no0d7.wav"),
	message: new Audio("https://files.catbox.moe/45qjxp.wav"),
	clientcommand: new Audio("https://files.catbox.moe/acdbqx.wav"),
	newworld: new Audio("https://files.catbox.moe/k6hvxs.mp3")
}
w.sfx.message.volume = 1/2;

linkElm.onclick = function(e) {
	if (linkParams.coord) {
		coord_link_click(e);
		return;
	}
	var lTileX = currentSelectedLinkCoords[0];
	var lTileY = currentSelectedLinkCoords[1];
	var lCharX = currentSelectedLinkCoords[2];
	var lCharY = currentSelectedLinkCoords[3];
	var charInfo = getCharInfo(lTileX, lTileY, lCharX, lCharY);
	var linkEvent = url_link_click(e);
	var prot = linkParams.protocol;
	var url = linkParams.url;

	if (prot == "javascript") {
		runJSLink(url, isMainPage() && charInfo.protection == 0);
		return false;
	} else if (prot == "com") {
		w.broadcastCommand(url);
		return false;
	} else if (prot == "comu") {
		w.broadcastCommand(url, true);
		return false;
	} else if (prot == "action") {
		// built-in client command
		runClientCommand(url, currentSelectedLinkCoords);
		return false;
	}
	if (["ourworldoftext.com", "owot.me"].includes(linkParams.host) && !e.ctrlKey) {
		client_commands.warp([linkElm.href.replace(RegExp("https?://" + linkParams.host + "/"), "")]);
		return false;
	}
	if (secureLink && !e.ctrlKey) {
		if ((isMainPage() && charInfo.protection == 0) && !isSafeHostname(linkParams.host)) {
			var acpt = confirm("Are you sure you want to visit this link?\n" + url);
			if (!acpt) {
				return false;
			}
		}
	}
	if (linkEvent && linkEvent[0]) {
		return linkEvent[0];
	}
}
async function showTitle(text='undefined') {
	let title = document.createElement("span");
	title.style = `font-family: monospace;
color: #fff;text-align: center;font-size: 4vh;
padding: 16px;border-radius:16px;background: #0007;
position: absolute;top:10%;left:0;
margin: 0 20%; width: 60%;
pointer-events: none;
z-index: 999;
opacity: 0;
filter: blur(32px)`
	title.innerText = text;
	document.body.append(title);
	while (+title.style.filter.slice(5, title.style.filter.indexOf(')') - 2) > 0.1) {
		title.style.opacity = +title.style.opacity + 0.03;
		title.style.filter = 'blur('+(+title.style.filter.slice(5, title.style.filter.indexOf(')') - 2) * 0.95 - 0.05)+'px)';
		await sleep(10);
	}
	await sleep(1500);
	while (+title.style.filter.slice(5, title.style.filter.indexOf(')') - 2) < 32) {
		title.style.opacity = +title.style.opacity - 0.04;
		title.style.filter = 'blur('+(+title.style.filter.slice(5, title.style.filter.indexOf(')') - 2) * 1.05)+'px)';
		await sleep(10);
	}
	title.remove();
}
w.off('socketConnect', window.onWarpConnect);
async function onWarpConnect() {
	await sleep(1500);
	let path = new URL(w.socket.socket.url).pathname;
	if (path.length > 4) path = path.slice(0, -4);
	else path = '/';
	showTitle(path);
	w.sfx.newworld.currentTime = 0;
	w.sfx.newworld.play();
}
(async function(){
	let socket = w.socket;
	let wc = onWarpConnect;
	while (onWarpConnect == wc) {
		if (socket != w.socket) {
			socket = w.socket;
			let onopen = w.socket.socket.onopen;
			w.socket.socket.onopen = function(){
				w.emit('socketConnect');
				onopen();
			}
		}
		await sleep(10)
	}
})()
w.on('socketConnect', onWarpConnect);
client_commands.warp = function (args) {
	var address = args[0];
	if(!address) address = "";
	positionX = 0;
	positionY = 0;
	writeBuffer = [];
	tellEdit = [];
	resetUI();
	stopPasting();
	if(address.charAt(0) == "/") address = address.substr(1);
	state.worldModel.pathname = address ? "/" + address : "";
	ws_path = createWsPath();
	w.changeSocket(ws_path, true);
	getWorldProps(address, "props", function(props, error) {
		if(!error) {
			reapplyProperties(props);			}
		});
	clientChatResponse("Warping to world: \"" + address + "\"");
	w.sfx.warp.currentTime = 0;
	w.sfx.warp.play();
}
/*fancyWarp = async function(address) {
	if (!address && address != 0) address = "";
	let origZoom = userZoom * 100;
	let time = -1;
	while (time < 0) {
		changeZoom(origZoom * (-1.5*Math.sin(Math.abs(time)*Math.PI/2)+2.5), true);
		await sleep(50);
		time += 1/8;
	}
	new Audio("https://files.catbox.moe/d180qh.mp3").play();
	positionX = 0;
	positionY = 0;
	writeBuffer = [];
	tellEdit = [];
	resetUI();
	stopPasting();
	if (address.charAt(0) == "/") address = address.substr(1);
	state.worldModel.pathname = "/" + address;
	ws_path = createWsPath();
	w.changeSocket(ws_path, true);
	getWorldProps(address, "props", function(props, error) {
		if (!error) {
			reapplyProperties(props);
		}
	});
	while (time < 1) {
		changeZoom(origZoom * (-1.5*Math.sin(Math.abs(time)*Math.PI/2)+2.5), true);
		await sleep(50);
		time += 1/24;
	}
	changeZoom(origZoom);
}*/
api_chat_send = Function("message", "opts", api_chat_send.toString()
	.match(new RegExp('(?<=\{)[^]{0,}(?=\})'))[0]
	.replace('(args);\n\t\t\tr',
		'(args);if(command!="warp"){w.sfx.clientcommand.currentTime=0;w.sfx.clientcommand.play()}\n\t\t\tr'));
w.off("chat", window.onMessageGot);
onMessageGot = (e)=>{if(e.hide)return;w.sfx.message.currentTime=0;w.sfx.message.play()}
w.on("chat", onMessageGot);
