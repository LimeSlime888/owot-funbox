palette = [0, 0xff, 0xff0000];
freeRoam = false;
latestPose = null;
overChars = [];
stickPos = [...convertTileToXY(...cursorCoords)];
coyote = 2;
climb = 0;
poses = {
	idle: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["/", 1, -1, -1],
		["\\", 1, 1, -1],
		["/", 2, -1, 0],
		["\\", 2, 1, 0]
	],
	mach0r: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["/", 1, -1, -1],
		["\\", 1, 1, -1],
		["-", 2, -1, 0],
		["\\", 2, 1, 0]
	],
	mach0l: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["/", 1, -1, -1],
		["\\", 1, 1, -1],
		["/", 2, -1, 0],
		["-", 2, 1, 0]
	],
	mach1r: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["/", 1, -1, -1],
		["\\", 1, 1, -1],
		[">", 2, -1, 0],
		["\\", 2, 1, 0]
	],
	mach1l: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["/", 1, -1, -1],
		["\\", 1, 1, -1],
		["/", 2, -1, 0],
		["<", 2, 1, 0]
	],
	mach2r: [
		["o", 0, 1, -2],
		["/", 0, 0, -1],
		["_", 1, -1, -2],
		["–", 1, 1, -1],
		[">", 2, -1, 0],
		["\\", 2, 1, 0]
	],
	mach2l: [
		["o", 0, -1, -2],
		["\\", 0, 0, -1],
		["–", 1, -1, -1],
		["_", 1, 1, -2],
		["/", 2, -1, 0],
		["<", 2, 1, 0]
	],
	fall: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["\\", 1, -1, -2],
		["/", 1, 1, -2],
		["/", 2, -1, 0],
		["\\", 2, 1, 0]
	],
	fastfall: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["\\", 1, -1, -2],
		["/", 1, 1, -2],
		["<", 2, -1, 0],
		[">", 2, 1, 0]
	],
	climbl: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["–", 1, -1, -1],
		["\\", 1, -1, -2],
		["/", 2, -1, 0],
		["<", 2, 0, 0]
	],
	climbr: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["/", 1, 1, -2],
		["–", 1, 1, -1],
		[">", 2, 0, 0],
		["\\", 2, 1, 0]
	]
}
drawStickman = function(x, y, pose){
	if (pose.constructor == String) pose = poses[pose];
	if (!pose) return false;
	x = Math.floor(x); y = Math.floor(y);
	let overCharsCopy = [...overChars];
	if (overCharsCopy.length) {
		overChars.splice(0).forEach(function(e){
			e[5] ??= {};
			queueCharToXY(e[2], e[3], e[0], e[1], _, -1, e[5], e[4]);
		})
	}
	for (let e of pose) {
		let info = overCharsCopy.findLast(f=>f[0]==x+e[2]&&f[1]==y+e[3]);
		if (info) { overChars.push(info) } else {
			info = getCharInfoXY(x+e[2], y+e[3]);
			overChars.push([x+e[2], y+e[3], info.char, info.color, info.bgColor, info.decoration])
		}
		queueCharToXY(e[0], palette[e[1]], x+e[2], y+e[3], _, 0, _, info.bgColor ?? info[4]);
	}
	flushQueue();
	latestPose = [x, y, pose];
	return true;
}
jumping = 0;
const fl = Math.floor;
getRelativeToStick = function(x, y){
	return getCharInfoXY(fl(stickPos[0]+x), fl(stickPos[1]+y))
}
gRTS = getRelativeToStick;
collideFilter = e=>e.char!=' '&&e.color!=0x2a7346;
floorFilter = e=>e.char!=' '&&!(e.color==0x2a7346&&keyDown);
lastDir = 0;
updatePos = function(direction=0, directionY=0, run=false, actions=[]){
	if(!run||!direction&&(!freeRoam||!directionY)){ranFor = 0}else{ranFor++}
	if (direction != 0) lastDir = direction;
	let xChange = Math.min(Math.max(-1024, direction*(0.75+(!!ranFor)/2+(ranFor>=5)/4)), 1024);
	let xChangeAccum = xChange;
	let minu = function(n){
		let pos = n >= 0
		if (pos) { return Math.max(n, 1) }
		else { return Math.min(n, -1) }
	}
	let xStep = function(x){
		const wallColliders = [
			gRTS(minu(x)+direction, 0),
			gRTS(minu(x)+direction, -1),
			gRTS(minu(x)+direction, -2)
		];
		let canGo = !wallColliders.some(collideFilter);
		return canGo;
	}
	while (xChangeAccum != 0) {
		let currChange = Math.max(Math.ceil(stickPos[0])-1, Math.min(stickPos[0] + xChangeAccum, Math.floor(stickPos[0])+1)) - stickPos[0];
		let canGo = xStep(currChange);
		if(canGo){stickPos[0]+=currChange;xChangeAccum-=currChange}
		else{break}
	}
	if (xChangeAccum == 0) {
		if (climb) {
			let canGo = false;
			if (!canGo) {
				const wallColliders = [
					gRTS(-climb, 0),
					gRTS(-climb, -1),
					gRTS(-climb, -2)
				];
				canGo = !wallColliders.some(collideFilter);
			}
			if (canGo) climb = 0;
		}
	}
	else {climb = direction}
	
	let floorColliders;
	if (climb) {
		floorColliders = [gRTS(0, 1), gRTS(climb, 1)]
	} else {
		floorColliders = [
			gRTS(-1, 1), gRTS(0, 1), gRTS(1, 1)
		]
	}
	let yChange = 0;
	let fall = !floorColliders.some(floorFilter);
	if (fall && xChange != 0 && xChangeAccum == 0) climb = 0;
	coyote -= fall;
	if (!fall) coyote = 2;
	let poseName = "idle";
	if (!freeRoam && actions.includes("jump") && (!fall || (coyote>0 && jumping<=0) || climb)) {
		jumping = 3;
	}
	if (direction || freeRoam && directionY) {
		let dirLet = lastDir<0?"l":"r";
		poseName = (ranFor?ranFor>=5?"mach2":"mach1":"mach0") + dirLet;
	}
	if (climb) {
		let climbLet = climb<0?"l":"r";
		poseName = "climb"+climbLet;
	}
	else if (!freeRoam && fall && jumping <= 0) {
		if (keyDown) poseName = "fastfall";
		else if (jumping <= -3) poseName = "fall";
		yChange += 1 + keyDown;
	}
	let ceilColliders;
	if (climb) {
		ceilColliders = [gRTS(0, -3), gRTS(climb, -3)]
	} else {
		ceilColliders = [
			gRTS(-1, -3), gRTS(0, -3), gRTS(1, -3)
		]
	}
	let ceilClear = !ceilColliders.some((e,f)=>collideFilter(e)&&floorFilter(e));
	if (!freeRoam && jumping > 0 && !climb) {
		if (ceilClear) {yChange -= 1}
		else {jumping = 0}
	}
	if (!freeRoam) jumping -= 1;
	if (freeRoam) {
		yChange +=  Math.min(Math.max(-1024, directionY*(0.75+(!!ranFor)/2+(ranFor>=5)/4))/2, 1024);
	} else if (climb) {
		if (keyUp && ceilClear) {
			yChange -= freeRoam ? moveMag : 1;
		}
		if (keyDown && fall) {
			yChange += freeRoam ? moveMag : 1;
		}
	}
	let yChangeAccum = yChange;
	let yStep = function(y){
		var colliders;
		let yCollide = y > 0 ? 1 : -3;
		if (climb) {
			colliders = [gRTS(0, yCollide), gRTS(climb, yCollide)]
		} else {
			colliders = [
				gRTS(-1, yCollide), gRTS(0, yCollide), gRTS(1, yCollide)
			]
		}
		let canGo = !colliders.some(function(e,f){
			return y >= 0 ? floorFilter(e) : collideFilter(e)
		});
		return canGo;
	}
	while (yChangeAccum != 0) {
		let currChange = Math.max(Math.ceil(stickPos[1])-1, Math.min(stickPos[1] + yChangeAccum, Math.floor(stickPos[1])+1)) - stickPos[1];
		let canGo = yStep(currChange);
		if(canGo){stickPos[1]+=currChange;yChangeAccum-=currChange}
		else{break}
	}
	return drawStickman(...stickPos, poseName);
}
if(!window.listenersApplied){
	[keyUp, keyLeft, keyRight, keyDown, keyShift] = [!1, !1, !1, !1, !1];
	document.addEventListener("keydown", function(e) {
		let k = e.key.toLowerCase();
		if (["arrowup", "w", " "].includes(k)) {
			keyUp = true;
		}
		if (["arrowdown", "s"].includes(k)) {
			keyDown = true;
		}
		if (["arrowleft", "a"].includes(k)) {
			keyLeft = true;
		}
		if (["arrowright", "d"].includes(k)) {
			keyRight = true;
		}
		if (k == "shift") {
			keyShift = true;
		}
	});
	document.addEventListener("keyup", function(e) {
		let k = e.key.toLowerCase();
		if (["arrowup", "w", " "].includes(k)) {
			keyUp = false;
		}
		if (["arrowdown", "s"].includes(k)) {
			keyDown = false;
		}
		if (["arrowleft", "a"].includes(k)) {
			keyLeft = false;
		}
		if (["arrowright", "d"].includes(k)) {
			keyRight = false;
		}
		if (k == "shift") {
			keyShift = false;
		}
	});
	listenersApplied = true;
}
theCool = function(){
	let actions = [];
	keyUp ? actions.push("jump") : 0;
	updatePos(keyRight-keyLeft, keyDown-keyUp, keyShift, actions);
}
stickmanUpdating = false;
clearInterval(window.stickInterval);
stickInterval = -1;
toggleStick = function(state=!stickmanUpdating, interval=100) {
	clearInterval(window.stickInterval);
	stickmanUpdating = state;
	if(!state)return;
	stickInterval = setInterval(_=>theCool(), interval);
}
toggleStick(1);
function makeStickPalModal() {
	var modal = new Modal();
	modal.setMinimumSize(512);
	modal.createForm();
	modal.inputField.style.gridTemplateColumns = "";
	modal.setFormTitle("Separate values with , and use hex code.");
	let pal = document.createElement("input");
	pal.type = "text";
	pal.style.width = "400px";
	modal.inputField.appendChild(pal);
	modal.onSubmit(function(){
		palette = pal.value.split(",").map(e=>parseInt(e, 16))
	})
	modal.onOpen(function(){
		pal.value = palette.map(e=>e.toString(16))
	})
	return w.ui.stickPalModal = modal;
}
makeStickPalModal();
menu.addOption("Change palette", _=>w.ui.stickPalModal.open());
menu.addCheckboxOption("Freeroam", _=>freeRoam=true, _=>freeRoam=false);
